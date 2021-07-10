<template>
  <div style='padding:30px;'>
    <el-button  type="primary" @click="fetchPoolList">Refresh</el-button>
    <el-table
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
      align="center">
      <el-table-column type='expand'>
        <template slot-scope='props'>
          <el-form label-position='left' inline class='demo-table-expand'>
            <el-card shadow="never">
              <el-form-item label='Description'>
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
        label='Status'
        prop='status'
        align="center"
      >
        <template scope='scope'>
          <el-tag :type="scope.row.status | statusFilter"> {{scope.row.status | statusPromptFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label='Pool Management'
        align="center"
        width="400%">
        <template slot-scope="scope" >
          <el-button  @click="isOracleCall(scope.row)"  size="primary"  plain>Oracle Call</el-button>
          <el-button  @click="isPayout(scope.row)"  size="primary"  plain>Payout</el-button>
          <el-button @click="isCancel(scope.row)"  size="primary" type="danger" plain>Cancel</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { base64ToString, parseTime } from '@/utils'
import { list_pools_by_owner, test_oracle_call, oracle_call, test_cancel_pool, cancel_pool, test_payout, payout } from '../../api/ops'
export default {
  data() {
    return {
      tableData: [],

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
        1: 'Cancelled',
        2: 'Finished'
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
    async fetchPoolList() {
      const neo3Dapi = window.neo3Dapi_save
      this.tableData = []
      try {
        const runnable = await list_pools_by_owner(neo3Dapi)
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
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    async oracleCall(val) {
      console.log(111111)
      const neo3Dapi = window.neo3Dapi_save
      try {
        console.log(val)
        const runnable = await test_oracle_call(val, neo3Dapi)
        console.log(runnable.state)
        if (runnable.state) {
          const response = await oracle_call(val, neo3Dapi)

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
            this.$message.error('No provider available.')
            break
          case 'CONNECTION_DENIED':
            this.$message.error('The user rejected the request to connect with your dApp.')
            break
          case 'CANCELED':
            this.$message.error('You have canceled your bet.')
            break
          case 'RPC_ERROR':
            this.$message.error('RPC connection failed.')
            break
          case 'MALFORMED_INPUT':
            this.$message.error('Oops! There seems to be a problem with your input parameters.')
        }
      }
    },
    isOracleCall(val) {
      this.$confirm('You will be charged 1 GAS for making the call plus any system / network fees incurred.', 'Confirm to make orcale call?', {
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
          this.oracleCall(val['pool_id']).then((val) => {
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
    async cancel(val) {
      const neo3Dapi = window.neo3Dapi_save
      try {
        console.log(val)
        const runnable = await test_cancel_pool(val, neo3Dapi)
        console.log(runnable.state)
        if (runnable.state) {
          const response = await cancel_pool(val, neo3Dapi)

          return {
            'message': 'success',
            'data': 'TxId: ' + response['txid'] + '\n Allow time for transaction confirmation. Please refresh manually.'
          }
        } else {
          return runnable
        }
      } catch ({ type, description, data }) {
        switch (type) {
          case 'NO_PROVIDER':
            this.$message.error('No provider available.')
            break
          case 'CONNECTION_DENIED':
            this.$message.error('The user rejected the request to connect with your dApp.')
            break
          case 'CANCELED':
            this.$message.error('You have canceled your bet.')
            break
          case 'RPC_ERROR':
            this.$message.error('RPC connection failed.')
            break
          case 'MALFORMED_INPUT':
            this.$message.error('Oops! There seems to be a problem with your input parameters.')
        }
      }
    },
    isCancel(val) {
      this.$confirm('You will lose all of your deposit plus the system / network fees incurred.', 'Confirm to cancel pool?', {
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
          this.cancel(val['pool_id']).then((val) => {
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
    isPayout(val) {
      this.$confirm('You will pay for the system / network fees incurred.', 'Confirm to process payout?', {
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
          this.payout(val['pool_id']).then((val) => {
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
    async payout(val) {
      const neo3Dapi = window.neo3Dapi_save
      try {
        console.log(val)
        const runnable = await test_payout(val, neo3Dapi)
        console.log(runnable.state)
        if (runnable.state) {
          const response = await payout(val, neo3Dapi)

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
