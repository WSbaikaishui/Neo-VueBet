<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Getting Started with NeoOps</span>
      </div>
      <div class="item">
        <el-card class="box-card">
          <el-row>
            <el-col :span=6>
              <el-card :body-style="{ padding: '0px' }">
                <img src="../../assets/NeoOps/Stock.png" class="image">
              </el-card>
            </el-col>
            <el-col :span=18 style="padding-left: 15px">
              <span class="title">Make Your Predictions</span>
              <hr>
              <p class="text">With NeoOps, binary options have never been easier. </p>
              <p class="text">Simply find a trading pair of your preference on Binance, investigate its price fluctuations, and settle your long or short positions before a pool closes. You are given two simple choices: either the price at expiry would exceed a prespecified strike price, or it wouldn't. This unique financial instrument will generate potentially great payoffs even when there is very little volatility in the market. </p>
              <p class="text">Everything is transparent: from expiry time, to the APIs we use, to the payoff structure, to even the underlying logic of our smart contract. Visit our <a style="color: #1482f0" href="https://github.com/zifanwangsteven/NeoOps">GitHub Page</a> for more.</p>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <el-row>
            <el-col :span=6>
              <el-card :body-style="{ padding: '0px' }">
                <img src="../../assets/NeoOps/Contract.png" class="image">
              </el-card>
            </el-col>
            <el-col :span=18 style="padding-left: 15px">
              <span class="title">Automated Payments</span>
              <hr>
              <p class="text">NeoOps is empowered by a Neo-N3 smart contract that takes care of everything: from creating a pool to finally settling it, thus minimizing your counterparty risk.</p>
              <p class="text">For players, all you need is a valid Neo-N3 address with a sufficient balance. Join a pool by transferring a fixed margin into the smart contract before the threshold timestamp.</p>
              <p class="text">For pool managers, create a pool by passing in a few parameters and putting down a good-faith deposit. At expiry, make an oracle call and initiate the payout process, and the contract will take care of the rest.</p>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <el-row>
            <el-col :span=6>
              <el-card :body-style="{ padding: '0px' }">
                <img src="../../assets/NeoOps/NeoLine.png" class="image">
              </el-card>
            </el-col>
            <el-col :span=18 style="padding-left: 15px">
              <span class="title">Your Assets, Secured</span>
              <hr>
              <p class="text">NeoOps protects your assets by using NeoLine wallets.</p>
              <p class="text">Your assets will not leave your account unless you explicitly give permissions for such transactions. All invocations of smart contracts: from creating a pool to taking a position, are settled with the dAPI provided by NeoLine. Enjoy the freedom to cancel a transaction at any time.</p>
              <p class="text">Not yet installed? Go ahead and install the <a style="color: #1482f0" href="https://chrome.google.com/webstore/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao?hl=en">NeoLine chrome extension</a>.</p>
              <hr>
              <el-button>Browse Openings</el-button>
              <el-button>List Your Positons</el-button>
              <el-button>Create a Pool</el-button>
              <el-button>List Your Pools</el-button>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.clearfix{
  font-size: xx-large;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
//.clearfix:after {
//  clear: both
//}

.box-card {
  width: border-box;
  height: border-box;
}
.text {
  font-size: 18px;
}

.item {
  padding: 18px 0;
}

.title {
  font-size: 25px;
}

.image {
  width: 100%;
  display: block;
}

</style>
