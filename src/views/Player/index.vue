<template>
  <div style="padding:30px;">
    <el-button  type="primary" @click="fetchPoolList">刷新页面</el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      align="center"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-card shadow="never">
              <el-form-item label="Description">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-card>
            <el-form-item label="Total Long">
              <span>{{ props.row.long }}</span>
            </el-form-item>
            <el-form-item label="Total Short">
              <span>{{ props.row.short }}</span>
            </el-form-item>
            <el-form-item label="Total Margin">
              <span>{{ props.row.total_margin }}</span>
            </el-form-item>
            <el-form-item label="Threshold">
              <span>{{ props.row.threshold | parseTime( '{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="PoolHash"
        prop="pool_id"
        align="center"
      />
      <el-table-column
        label="Token"
        prop="token"
        align="center"
      >
        <template scope="scope" style="text-align: center">
          {{ scope.row.token === 0? 'NEO' : 'GAS' }}
        </template>
      </el-table-column>
      <el-table-column
        label="Margin"
        prop="margin"
        align="center"
      />
      <el-table-column
        label="Expiry"
        prop="expiry "
        align="center"
      >
        <template scope="scope" style="text-align: center">
          {{ scope.row.expiry | parseTime( '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="Symbol"
        prop="symbol"
        align="center"
      >
        <template scope="scope">
          {{ scope.row.symbol }}
        </template>
      </el-table-column>
      <el-table-column
        label="Strike Price"
        prop="strike"
        align="center"
      >
        <template scope="scope">
          {{ scope.row.strike_price }}
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        prop="status"
        align="center"
      >
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter"> {{ scope.row.status | statusPromptFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Position"
        prop="position"
        align="center"
      >
        <template scope="scope">
          <el-tag v-if="scope.row.position === '1'">LONG</el-tag>
          <el-tag v-else type="danger">SHORT</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Cancel" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="large" plain @click="onCancelBet(scope.row, scope.$index)">Cancel</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>
<script>

import { base64ToString, parseTime } from '@/utils'
import { cancel_bet, test_cancel_bet, list_pools_by_player } from '../../api/ops'
export default {
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
    statusPromptFilter(status) {
      const statusMap = {
        0: 'Ongoing',
        1: 'Finished',
        2: 'Canceled'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableData: [],

      content: '',
      loading: true

    }
  },
  created: function() {
    if (window.neo3Dapi_save === '') {
      this.tableData = []
      this.loading = false
      this.$message.error('请先连接NeoLine')
    } else {
      this.fetchPoolList()
    }
  },
  methods: {
    async fetchPoolList() {
      const neo3Dapi = window.neo3Dapi_save
      this.tableData = []
      try {
        const runnable = await list_pools_by_player(neo3Dapi)
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
              } else if (base64ToString(res[j]['key']['value']) === 'position') {
                json[base64ToString(res[j]['key']['value'])] = JSON.stringify(base64ToString(res[j]['value']['value'])).slice(6, 7)
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
    async cancelBet(pool_id) {
      const neo3Dapi = window.neo3Dapi_save
      try {
        const runnable = await test_cancel_bet(pool_id, neo3Dapi)
        if (runnable.state) {
          const response = await cancel_bet(pool_id, neo3Dapi)
          return {
            'message': 'success',
            'data': 'TxId: ' + response['txid'] + '\n 区块提交需要时间，请手动刷新'
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
    onCancelBet(val, index) {
      this.$confirm('You will be charged a 0.3% of your margin as penalty, plus any system / network fees incurred.', 'Confirm cancellation of bet?', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      }).then(() => {
        if (window.neo3Dapi_save === '') {
          this.$message({
            type: 'error',
            message: 'Please connect to NeoLine first'
          })
        } else {
          this.cancelBet(val['pool_id']).then((val) => {
            this.$message({
              type: val.message,
              message: val.data
            })
            this.tableData.splice(index, 1)
          }
          )
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'You have cancelled the transaction.'
        })
      })
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
