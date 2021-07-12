<template>
  <div style='padding:30px;'>
    <el-button  type="primary" @click="fetchPoolList">Refresh</el-button>
    <el-table
      v-loading="loading"
      :data='tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)'
      style='width: 100%'
      align="center">
      <el-table-column type='expand'>
        <template slot-scope='props'>
          <el-form label-position='left' inline class='demo-table-expand'>
            <el-card shadow="never">
              <el-form-item label='Description' style="width: 100%">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-card>
            <el-form-item label='Total Long'>
              <span>{{ props.row.long }}</span>
            </el-form-item>
            <el-form-item label='Total Short'>
              <span>{{ props.row.short }}</span>
            </el-form-item>
            <el-form-item label='Total Margin'>
              <span>{{ props.row.total_margin }}</span>
            </el-form-item>
            <el-form-item label='Threshold'>
              <span>{{ props.row.threshold | parseTime( '{y}-{m}-{d} {h}:{i}')}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label='PoolHash'
        prop='pool_id'
        align="center">
      </el-table-column>
      <el-table-column
        label='Token'
        prop='token'
        align="center"
      >
        <template scope='scope' style="text-align: center">
          {{  scope.row.token === 0? 'NEO' : 'GAS' }}
        </template>
      </el-table-column>
      <el-table-column
        label='Margin'
        prop='margin'
        align="center">
      </el-table-column>
      <el-table-column
        label='Expiry'
        prop='expiry '
        align="center"
      >
        <template scope='scope' style="text-align: center">
          {{  scope.row.expiry | parseTime( '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column
        label='Symbol'
        prop='symbol'
        align="center"
      >
        <template scope='scope'>
          {{  scope.row.symbol }}
        </template>
      </el-table-column>
      <el-table-column
        label='Strike Price'
        prop='strike'
        align="center"
      >
        <template scope='scope'>
          {{  scope.row.strike_price }}
        </template>
      </el-table-column>

      <el-table-column
        label='Create Position'
        width="240"
        align="center">
        <template slot-scope="scope" >
          <el-button @click="isBet(scope.row,1)"  type="primary" plain>LONG</el-button>
          <el-button @click="isBet(scope.row,2)"  type="danger" plain>SHORT</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination align='center'
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[5,10,20]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="tableData.length"
                    style="margin-top: 50px">
    </el-pagination>
  </div>
</template>

<script>
import { base64ToString, parseTime } from '@/utils'
import { test_bet, bet, list_ongoing_pools } from '../../api/ops'
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 20,
      pageSize: 5,
      content: '',
      loading: true

    }
  },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'warning',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusPromptFilter(status){
      const statusMap = {
        0: 'Ongoing',
        1: 'Finished',
        2: 'Canceled'
      }
      return statusMap[status]
    }
  },

  created: function() {
    if (window.neo3Dapi_save === '') {
      this.tableData = []
      this.loading = false
      this.$message.error('Please connect to NeoLine first.')
    } else {
      this.fetchPoolList()
    }
  },

  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    onSortChange({ prop, order }) {
      this.tableData = this.tableData.sort(this.compare(prop, order))
      console.log(this.tableData)
    },
    async fetchPoolList() {
      this.loading = true
      const neo3Dapi = window.neo3Dapi_save
      this.tableData = []
      try {
        const runnable = await list_ongoing_pools(neo3Dapi)
        const result = runnable['stack'][0]['value']
        for (var i in result) {
          const res = result[i]['value']['value']
          const json = {}
          for (var j in res) {
            if (res[ j ]['value']['type'] === 'Integer') {
              json[base64ToString(res[j]['key']['value'])] = res[j]['value']['value']
            } else {
              if (base64ToString(res[j]['key']['value']) === 'pool_owner' || base64ToString(res[j]['key']['value']) === 'token_id') {
                json[base64ToString(res[j]['key']['value'])] = res[j]['value']['value']
              } else {
                json[base64ToString(res[j]['key']['value'])] = base64ToString(res[j]['value']['value'])
              }
            }
          }
          json['pool_id'] = result[i]['key']['value']
          var url = json['url']
          var i1 = url.indexOf('symbol=')

          var i2 = url.indexOf('&')
          json['symbol'] = url.slice(i1 + 7, i2)
          this.tableData.push(json)
        }
        this.tableData = this.tableData.sort(this.compare('deposit', 'descending'))
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },



    async playBet(val, option) {
      const neo3Dapi = window.neo3Dapi_save
      try {
        const runnable = await test_bet(val, option, neo3Dapi)
        if (runnable.state) {
          const response = await bet(val, option, neo3Dapi)
          console.log(response)
          return {
            'message': 'success',
            'data': 'TxId: ' + response['txid']
          }
        } else {
          return runnable
        }
      } catch ({ type, description, data }) {
        switch (type) {
          case 'NO_PROVIDER':
            this.$message({
              'type': 'error',
              'message': 'There is currently no provider available at NeoLine.'
            })
            break
          case 'CONNECTION_DENIED':
            this.$message({
              'type': 'info',
              'message': 'You have declined our request to connect with NeoLine.'
            })
            break
          case 'CANCELED':
            this.$message({
              'type': 'info',
              'message': 'You have cancelled the transaction.'
            })
            break
          case 'RPC_ERROR':
            this.$message({
              'type': 'error',
              'message': 'RPC Client failed.'
            })
            break
          case 'MALFORMED_INPUT':
            this.$message({
              'type': 'error',
              'message': 'There is something wrong with your input format.'
            })
        }
      }
    },
    isBet(val, option) {
      this.$confirm('You will be charged the margin specified in token, plus any system / network fees incurred.', option === 1 ? 'Confirm to settle long position?' : 'Confirm to settle short position?', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      }).then(() => {
        if (window.neo3Dapi_save === '') {
          this.$message({
            type: 'error',
            message: 'Please connect to NeoLine first.'
          })
        } else {
          this.playBet(val['pool_id'], option).then((val) => {
            this.$message({
              type: val.message,
              message: val.data
            })
          }
          )
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Transaction cancelled.'
        })
      })
    },
    compare(propertyName, sort) {
      return function(obj1, obj2) {
        var value1 = obj1[propertyName]
        var value2 = obj2[propertyName]
        if (typeof value1 === 'string' && typeof value2 === 'string') {
          const res = value1.localeCompare(value2, 'zh')
          return sort === 'ascending' ? res : -res
        } else {
          if (value1 <= value2) {
            return sort === 'ascending' ? -1 : 1
          } else if (value1 > value2) {
            return sort === 'ascending' ? 1 : -1
          }
        }
      }
    }

  }

}

</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
