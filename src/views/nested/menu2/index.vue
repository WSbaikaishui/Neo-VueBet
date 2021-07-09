<template>
  <div style='padding:30px;'>
    <el-alert :closable='false' title='menu 2' />
    <el-table
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
    align="center">
      <el-table-column type='expand'>
        <template slot-scope='props'>
          <el-form label-position='left' inline class='demo-table-expand'>
            <el-form-item label='PoolHash'>
              <span>{{ props.row.pool_id }}</span>
            </el-form-item>
            <el-form-item label='Description'>
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label='Strike Price'>
              <span>{{ props.row.strike_price }}</span>
            </el-form-item>
<!--            <el-form-item label='Expiry'>-->
<!--              <span>{{ props.row.expiry |parseTime( '{y}-{m}-{d} {h}:{i}') }}</span>-->
<!--            </el-form-item>-->
            <el-form-item label='Margin'>
              <span>{{ props.row.margin }}</span>
            </el-form-item>
            <el-form-item label='TotalMargin'>
              <span>{{ props.row.total_margin }}</span>
            </el-form-item>

            <el-form-item label='Long'>
              <span>{{ props.row.long }}</span>
            </el-form-item>
            <el-form-item label='Short'>
              <span>{{ props.row.short }}</span>
            </el-form-item>
            <el-form-item label='threshold'>
              <span>{{ props.row.threshold | parseTime( '{y}-{m}-{d} {h}:{i}')}}</span>
            </el-form-item>
            <el-form-item label='倒计时'>
              <span>{{ props.row.symbol }}</span>
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
        prop='symbol'>
                <template scope='scope'>
                  {{  scope.row.symbol }}
                </template>
      </el-table-column>
      <el-table-column
        label='Threshold'
        prop='threshold'>
        <template scope='scope'>
          {{  scope.row.threshold | parseTime( '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column
        label='Bet'
      align="center">
        <template slot-scope="scope" >
            <el-button @click="isBet(scope.row,1)"  type="primary" plain>Short</el-button>
          <el-button @click="isBet(scope.row,2)"  type="primary" plain>Long</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import Neon from '@cityofzion/neon-js'
import { base64ToString, parseTime } from '@/utils'
import Ops,{ test_bet, bet } from '../../../api/ops'
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
    }
  },

  created: function() {
    // Loading.service({ body: true })
    this.fetchPoolList()
    // Loading.service({ body: false })
    // var that = this
    // new Promise(function(resolve, reject) {
    //   setTimeout(function() {
    //     console.log('First')
    //     that.fetchPoolList()
    //     resolve()
    //   }, 1000)
    // }).then(function() {
    //   return new Promise(function(resolve, reject) {
    //     setTimeout(function() {
    //       console.log('Second')
    //       for (let i in that.tableData) {
    //         that.tableData[i].countDownTime = ''
    //         that.countDown(i)
    //         console.log(i)
    //       }
    //       resolve()
    //     }, 4000)
    //   })
    // })//this.countdowm(1635711484365)
  },

  methods: {
    fetchPoolList() {
      const client = Neon.create.rpcClient('http://seed2t.neo.org:20332')

      client.invokeFunction(Ops.BET_CONTRACT, 'list_ongoing_pools')
        .then(value => {
          var result = value['stack'][0]['value']
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
          }console.log(this.tableData)
          this.loading = false
        }
        )
        .catch(err => console.log(err))
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
            alert('No provider available.')
            break
          case 'CONNECTION_DENIED':
            alert('The user rejected the request to connect with your dApp.')
            break
          case 'CANCELED':
            alert('You have canceled your bet.')
            break
          case 'RPC_ERROR':
            alert('RPC connection failed.')
            break
          case 'MALFORMED_INPUT':
            alert('Oops! There seems to be a problem with your input parameters.')
        }
      }
      console.log()
    },
    isBet(val, option) {
      this.$confirm(option === 1 ? '此操作将下注为短仓?' : '此操作将下注为长仓?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if (window.neo3Dapi_save === '') {
          this.$message({
            type: 'error',
            message: '请先连接NeoLine'
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
          message: '已取消下注'
        })
      })
    },

    countDownFun(time) {
      // console.log(time)

      const startTime = new Date()
      const end = new Date(time)
      // console.log(end)
      const result = parseInt((end - startTime) / 1000)
      const d = parseInt(result / (24 * 60 * 60))
      const h = parseInt((result / (60 * 60)) % 24)
      const m = parseInt((result / 60) % 60)
      const s = parseInt(result % 60)

      if (result <= 0) {
        return '倒计时结束'
      }
      if (h < 10) {
        h = '0' + h
      }
      if (s < 10) {
        s = '0' + s
      }
      if (h === 0 && m === 0) {
        return s + '秒'
      } else if (h === 0) {
        return m + '分' + s + '秒'
      } else if(d === 0) {
        return h + '时' + m + '分' + s + '秒'
      } else {
        return d + '天' + h + '时' + m + '分' + s + '秒'
      }
    },

    // 定时器
    // 页面多个倒计时 归零时清除
    countDown(i) {
      var that = this
      const item = that.tableData[i]
      that.tableData[i].countDownFn = setInterval(() => {
        //  console.log(that.countDownFun(item.endTime))
        if (that.countDownFun(item.countDownTime) === '倒计时结束') {
          clearInterval(that.tableData[i].countDownFn) //清除定时器
        } else {
          item.countDownTime = that.countDownFun(1635711484365)
          that.$set(
            that.tableData,
            item.countDownTime,
            that.countDownFun(item.expiry)
          )
        }
      }, 1000)
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
