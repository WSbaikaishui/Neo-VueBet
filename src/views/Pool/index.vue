<template>
  <div class="app-container">
    <el-header class="title">Create a Pool</el-header>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="Token id" prop="token">
        <el-select v-model.number="form.token" size="medium" placeholder="Token accepted">
          <el-option label="NEO" value="0" />
          <el-option label="GAS" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="Symbol" prop="symbol">
        <el-select
          v-model="form.symbol"
          filterable
          remote
          reserve-keyword
          placeholder="Type to search"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-tooltip class="item" content="The margin your players should invest. In integer." placement="top-start">
        <el-form-item label="Margin" prop="margin">
          <el-input-number v-model.number="form.margin" :precision="0" :min="1" @change="handleChange" placeholder="Please input the margin you require (In integer)" size="large"/>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" content="The deposit you would like to invest. In GAS (integer)." placement="top-start">
        <el-form-item label="Desposit" prop="deposit">
          <el-input-number v-model.number="form.deposit" :precision="0" :min="100000000" @change="handleChange" placeholder="Please input the deposit you would invest (In integer, GAS)" size="large"/>
        </el-form-item>
      </el-tooltip>
      <el-form-item label="Expiry" prop="expiry">
        <el-date-picker v-model.number="form.expiry" type="datetime" placeholder="Pick an expiry for your pool" style="width: 50%" value-format="timestamp" />
      </el-form-item>
      <el-form-item label="Threshold" prop="threshold">
        <el-date-picker v-model.number="form.threshold" type="datetime" placeholder="Pick a threshold for players to join" style="width: 50%" value-format="timestamp" />
      </el-form-item>
      <el-form-item label="Strike Price" prop="strike">
        <el-input v-model="form.strike" placeholder="Strike price in decimals" style="width: 50%" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="4" maxlength="300" show-word-limit placeholder="Please describe your pool briefly in 300 words." />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">Create</el-button>
        <el-button @click="resetForm('form')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import neo3, { test_pool_init, pool_init } from '../../api/ops'

export default {
  data() {
    return {
      form: {
        token: '',
        symbol: '',
        margin: 1,
        deposit: 2,
        expiry: '',
        threshold: '',
        strike: '',
        description: ''
      },
      loading: false,
      options: [],
      symbolsList: [],
      symbols: ['ETHBTC', 'LTCBTC', 'BNBBTC', 'NEOBTC', 'QTUMETH', 'EOSETH', 'SNTETH', 'BNTETH', 'BCCBTC', 'GASBTC', 'BNBETH', 'BTCUSDT', 'ETHUSDT', 'HSRBTC', 'OAXETH', 'DNTETH', 'MCOETH', 'ICNETH', 'MCOBTC', 'WTCBTC', 'WTCETH', 'LRCBTC', 'LRCETH', 'QTUMBTC', 'YOYOBTC', 'OMGBTC', 'OMGETH', 'ZRXBTC', 'ZRXETH', 'STRATBTC', 'STRATETH', 'SNGLSBTC', 'SNGLSETH', 'BQXBTC', 'BQXETH', 'KNCBTC', 'KNCETH', 'FUNBTC', 'FUNETH', 'SNMBTC', 'SNMETH', 'NEOETH', 'IOTABTC', 'IOTAETH', 'LINKBTC', 'LINKETH', 'XVGBTC', 'XVGETH', 'SALTBTC', 'SALTETH', 'MDABTC', 'MDAETH', 'MTLBTC', 'MTLETH', 'SUBBTC', 'SUBETH', 'EOSBTC', 'SNTBTC', 'ETCETH', 'ETCBTC', 'MTHBTC', 'MTHETH', 'ENGBTC', 'ENGETH', 'DNTBTC', 'ZECBTC', 'ZECETH', 'BNTBTC', 'ASTBTC', 'ASTETH', 'DASHBTC', 'DASHETH', 'OAXBTC', 'ICNBTC', 'BTGBTC', 'BTGETH', 'EVXBTC', 'EVXETH', 'REQBTC', 'REQETH', 'VIBBTC', 'VIBETH', 'HSRETH', 'TRXBTC', 'TRXETH', 'POWRBTC', 'POWRETH', 'ARKBTC', 'ARKETH', 'YOYOETH', 'XRPBTC', 'XRPETH', 'MODBTC', 'MODETH', 'ENJBTC', 'ENJETH', 'STORJBTC', 'STORJETH', 'BNBUSDT', 'VENBNB', 'YOYOBNB', 'POWRBNB', 'VENBTC', 'VENETH', 'KMDBTC', 'KMDETH', 'NULSBNB', 'RCNBTC', 'RCNETH', 'RCNBNB', 'NULSBTC', 'NULSETH', 'RDNBTC', 'RDNETH', 'RDNBNB', 'XMRBTC', 'XMRETH', 'DLTBNB', 'WTCBNB', 'DLTBTC', 'DLTETH', 'AMBBTC', 'AMBETH', 'AMBBNB', 'BCCETH', 'BCCUSDT', 'BCCBNB', 'BATBTC', 'BATETH', 'BATBNB', 'BCPTBTC', 'BCPTETH', 'BCPTBNB', 'ARNBTC', 'ARNETH', 'GVTBTC', 'GVTETH', 'CDTBTC', 'CDTETH', 'GXSBTC', 'GXSETH', 'NEOUSDT', 'NEOBNB', 'POEBTC', 'POEETH', 'QSPBTC', 'QSPETH', 'QSPBNB', 'BTSBTC', 'BTSETH', 'BTSBNB', 'XZCBTC', 'XZCETH', 'XZCBNB', 'LSKBTC', 'LSKETH', 'LSKBNB', 'TNTBTC', 'TNTETH', 'FUELBTC', 'FUELETH', 'MANABTC', 'MANAETH', 'BCDBTC', 'BCDETH', 'DGDBTC', 'DGDETH', 'IOTABNB', 'ADXBTC', 'ADXETH', 'ADXBNB', 'ADABTC', 'ADAETH', 'PPTBTC', 'PPTETH', 'CMTBTC', 'CMTETH', 'CMTBNB', 'XLMBTC', 'XLMETH', 'XLMBNB', 'CNDBTC', 'CNDETH', 'CNDBNB', 'LENDBTC', 'LENDETH', 'WABIBTC', 'WABIETH', 'WABIBNB', 'LTCETH', 'LTCUSDT', 'LTCBNB', 'TNBBTC', 'TNBETH', 'WAVESBTC', 'WAVESETH', 'WAVESBNB', 'GTOBTC', 'GTOETH', 'GTOBNB', 'ICXBTC', 'ICXETH', 'ICXBNB', 'OSTBTC', 'OSTETH', 'OSTBNB', 'ELFBTC', 'ELFETH', 'AIONBTC', 'AIONETH', 'AIONBNB', 'NEBLBTC', 'NEBLETH', 'NEBLBNB', 'BRDBTC', 'BRDETH', 'BRDBNB', 'MCOBNB', 'EDOBTC', 'EDOETH', 'WINGSBTC', 'WINGSETH', 'NAVBTC', 'NAVETH', 'NAVBNB', 'LUNBTC', 'LUNETH', 'TRIGBTC', 'TRIGETH', 'TRIGBNB', 'APPCBTC', 'APPCETH', 'APPCBNB', 'VIBEBTC', 'VIBEETH', 'RLCBTC', 'RLCETH', 'RLCBNB', 'INSBTC', 'INSETH', 'PIVXBTC', 'PIVXETH', 'PIVXBNB', 'IOSTBTC', 'IOSTETH', 'CHATBTC', 'CHATETH', 'STEEMBTC', 'STEEMETH', 'STEEMBNB', 'NANOBTC', 'NANOETH', 'NANOBNB', 'VIABTC', 'VIAETH', 'VIABNB', 'BLZBTC', 'BLZETH', 'BLZBNB', 'AEBTC', 'AEETH', 'AEBNB', 'RPXBTC', 'RPXETH', 'RPXBNB', 'NCASHBTC', 'NCASHETH', 'NCASHBNB', 'POABTC', 'POAETH', 'POABNB', 'ZILBTC', 'ZILETH', 'ZILBNB', 'ONTBTC', 'ONTETH', 'ONTBNB', 'STORMBTC', 'STORMETH', 'STORMBNB', 'QTUMBNB', 'QTUMUSDT', 'XEMBTC', 'XEMETH', 'XEMBNB', 'WANBTC', 'WANETH', 'WANBNB', 'WPRBTC', 'WPRETH', 'QLCBTC', 'QLCETH', 'SYSBTC', 'SYSETH', 'SYSBNB', 'QLCBNB', 'GRSBTC', 'GRSETH', 'ADAUSDT', 'ADABNB', 'CLOAKBTC', 'CLOAKETH', 'GNTBTC', 'GNTETH', 'GNTBNB', 'LOOMBTC', 'LOOMETH', 'LOOMBNB', 'XRPUSDT', 'BCNBTC', 'BCNETH', 'BCNBNB', 'REPBTC', 'REPETH', 'REPBNB', 'BTCTUSD', 'TUSDBTC', 'ETHTUSD', 'TUSDETH', 'TUSDBNB', 'ZENBTC', 'ZENETH', 'ZENBNB', 'SKYBTC', 'SKYETH', 'SKYBNB', 'EOSUSDT', 'EOSBNB', 'CVCBTC', 'CVCETH', 'CVCBNB', 'THETABTC', 'THETAETH', 'THETABNB', 'XRPBNB', 'TUSDUSDT', 'IOTAUSDT', 'XLMUSDT', 'IOTXBTC', 'IOTXETH', 'QKCBTC', 'QKCETH', 'AGIBTC', 'AGIETH', 'AGIBNB', 'NXSBTC', 'NXSETH', 'NXSBNB', 'ENJBNB', 'DATABTC', 'DATAETH', 'ONTUSDT', 'TRXBNB', 'TRXUSDT', 'ETCUSDT', 'ETCBNB', 'ICXUSDT', 'SCBTC', 'SCETH', 'SCBNB', 'NPXSBTC', 'NPXSETH', 'VENUSDT', 'KEYBTC', 'KEYETH', 'NASBTC', 'NASETH', 'NASBNB', 'MFTBTC', 'MFTETH', 'MFTBNB', 'DENTBTC', 'DENTETH', 'ARDRBTC', 'ARDRETH', 'ARDRBNB', 'NULSUSDT', 'HOTBTC', 'HOTETH', 'VETBTC', 'VETETH', 'VETUSDT', 'VETBNB', 'DOCKBTC', 'DOCKETH', 'POLYBTC', 'POLYBNB', 'PHXBTC', 'PHXETH', 'PHXBNB', 'HCBTC', 'HCETH', 'GOBTC', 'GOBNB', 'PAXBTC', 'PAXBNB', 'PAXUSDT', 'PAXETH', 'RVNBTC', 'RVNBNB', 'DCRBTC', 'DCRBNB', 'USDCBNB', 'MITHBTC', 'MITHBNB', 'BCHABCBTC', 'BCHSVBTC', 'BCHABCUSDT', 'BCHSVUSDT', 'BNBPAX', 'BTCPAX', 'ETHPAX', 'XRPPAX', 'EOSPAX', 'XLMPAX', 'RENBTC', 'RENBNB', 'BNBTUSD', 'XRPTUSD', 'EOSTUSD', 'XLMTUSD', 'BNBUSDC', 'BTCUSDC', 'ETHUSDC', 'XRPUSDC', 'EOSUSDC', 'XLMUSDC', 'USDCUSDT', 'ADATUSD', 'TRXTUSD', 'NEOTUSD', 'TRXXRP', 'XZCXRP', 'PAXTUSD', 'USDCTUSD', 'USDCPAX', 'LINKUSDT', 'LINKTUSD', 'LINKPAX', 'LINKUSDC', 'WAVESUSDT', 'WAVESTUSD', 'WAVESPAX', 'WAVESUSDC', 'BCHABCTUSD', 'BCHABCPAX', 'BCHABCUSDC', 'BCHSVTUSD', 'BCHSVPAX', 'BCHSVUSDC', 'LTCTUSD', 'LTCPAX', 'LTCUSDC', 'TRXPAX', 'TRXUSDC', 'BTTBTC', 'BTTBNB', 'BTTUSDT', 'BNBUSDS', 'BTCUSDS', 'USDSUSDT', 'USDSPAX', 'USDSTUSD', 'USDSUSDC', 'BTTPAX', 'BTTTUSD', 'BTTUSDC', 'ONGBNB', 'ONGBTC', 'ONGUSDT', 'HOTBNB', 'HOTUSDT', 'ZILUSDT', 'ZRXBNB', 'ZRXUSDT', 'FETBNB', 'FETBTC', 'FETUSDT', 'BATUSDT', 'XMRBNB', 'XMRUSDT', 'ZECBNB', 'ZECUSDT', 'ZECPAX', 'ZECTUSD', 'ZECUSDC', 'IOSTBNB', 'IOSTUSDT', 'CELRBNB', 'CELRBTC', 'CELRUSDT', 'ADAPAX', 'ADAUSDC', 'NEOPAX', 'NEOUSDC', 'DASHBNB', 'DASHUSDT', 'NANOUSDT', 'OMGBNB', 'OMGUSDT', 'THETAUSDT', 'ENJUSDT', 'MITHUSDT', 'MATICBNB', 'MATICBTC', 'MATICUSDT', 'ATOMBNB', 'ATOMBTC', 'ATOMUSDT', 'ATOMUSDC', 'ATOMPAX', 'ATOMTUSD', 'ETCUSDC', 'ETCPAX', 'ETCTUSD', 'BATUSDC', 'BATPAX', 'BATTUSD', 'PHBBNB', 'PHBBTC', 'PHBUSDC', 'PHBTUSD', 'PHBPAX', 'TFUELBNB', 'TFUELBTC', 'TFUELUSDT', 'TFUELUSDC', 'TFUELTUSD', 'TFUELPAX', 'ONEBNB', 'ONEBTC', 'ONEUSDT', 'ONETUSD', 'ONEPAX', 'ONEUSDC', 'FTMBNB', 'FTMBTC', 'FTMUSDT', 'FTMTUSD', 'FTMPAX', 'FTMUSDC', 'BTCBBTC', 'BCPTTUSD', 'BCPTPAX', 'BCPTUSDC', 'ALGOBNB', 'ALGOBTC', 'ALGOUSDT', 'ALGOTUSD', 'ALGOPAX', 'ALGOUSDC', 'USDSBUSDT', 'USDSBUSDS', 'GTOUSDT', 'GTOPAX', 'GTOTUSD', 'GTOUSDC', 'ERDBNB', 'ERDBTC', 'ERDUSDT', 'ERDPAX', 'ERDUSDC', 'DOGEBNB', 'DOGEBTC', 'DOGEUSDT', 'DOGEPAX', 'DOGEUSDC', 'DUSKBNB', 'DUSKBTC', 'DUSKUSDT', 'DUSKUSDC', 'DUSKPAX', 'BGBPUSDC', 'ANKRBNB', 'ANKRBTC', 'ANKRUSDT', 'ANKRTUSD', 'ANKRPAX', 'ANKRUSDC', 'ONTPAX', 'ONTUSDC', 'WINBNB', 'WINBTC', 'WINUSDT', 'WINUSDC', 'COSBNB', 'COSBTC', 'COSUSDT', 'TUSDBTUSD', 'NPXSUSDT', 'NPXSUSDC', 'COCOSBNB', 'COCOSBTC', 'COCOSUSDT', 'MTLUSDT', 'TOMOBNB', 'TOMOBTC', 'TOMOUSDT', 'TOMOUSDC', 'PERLBNB', 'PERLBTC', 'PERLUSDC', 'PERLUSDT', 'DENTUSDT', 'MFTUSDT', 'KEYUSDT', 'STORMUSDT', 'DOCKUSDT', 'WANUSDT', 'FUNUSDT', 'CVCUSDT', 'BTTTRX', 'WINTRX', 'CHZBNB', 'CHZBTC', 'CHZUSDT', 'BANDBNB', 'BANDBTC', 'BANDUSDT', 'BNBBUSD', 'BTCBUSD', 'BUSDUSDT', 'BEAMBNB', 'BEAMBTC', 'BEAMUSDT', 'XTZBNB', 'XTZBTC', 'XTZUSDT', 'RENUSDT', 'RVNUSDT', 'HCUSDT', 'HBARBNB', 'HBARBTC', 'HBARUSDT', 'NKNBNB', 'NKNBTC', 'NKNUSDT', 'XRPBUSD', 'ETHBUSD', 'BCHABCBUSD', 'LTCBUSD', 'LINKBUSD', 'ETCBUSD', 'STXBNB', 'STXBTC', 'STXUSDT', 'KAVABNB', 'KAVABTC', 'KAVAUSDT', 'BUSDNGN', 'BNBNGN', 'BTCNGN', 'ARPABNB', 'ARPABTC', 'ARPAUSDT', 'TRXBUSD', 'EOSBUSD', 'IOTXUSDT', 'RLCUSDT', 'MCOUSDT', 'XLMBUSD', 'ADABUSD', 'CTXCBNB', 'CTXCBTC', 'CTXCUSDT', 'BCHBNB', 'BCHBTC', 'BCHUSDT', 'BCHUSDC', 'BCHTUSD', 'BCHPAX', 'BCHBUSD', 'BTCRUB', 'ETHRUB', 'XRPRUB', 'BNBRUB', 'TROYBNB', 'TROYBTC', 'TROYUSDT', 'BUSDRUB', 'QTUMBUSD', 'VETBUSD', 'VITEBNB', 'VITEBTC', 'VITEUSDT', 'FTTBNB', 'FTTBTC', 'FTTUSDT', 'BTCTRY', 'BNBTRY', 'BUSDTRY', 'ETHTRY', 'XRPTRY', 'USDTTRY', 'USDTRUB', 'BTCEUR', 'ETHEUR', 'BNBEUR', 'XRPEUR', 'EURBUSD', 'EURUSDT', 'OGNBNB', 'OGNBTC', 'OGNUSDT', 'DREPBNB', 'DREPBTC', 'DREPUSDT', 'BULLUSDT', 'BULLBUSD', 'BEARUSDT', 'BEARBUSD', 'ETHBULLUSDT', 'ETHBULLBUSD', 'ETHBEARUSDT', 'ETHBEARBUSD', 'TCTBNB', 'TCTBTC', 'TCTUSDT', 'WRXBNB', 'WRXBTC', 'WRXUSDT', 'ICXBUSD', 'BTSUSDT', 'BTSBUSD', 'LSKUSDT', 'BNTUSDT', 'BNTBUSD', 'LTOBNB', 'LTOBTC', 'LTOUSDT', 'ATOMBUSD', 'DASHBUSD', 'NEOBUSD', 'WAVESBUSD', 'XTZBUSD', 'EOSBULLUSDT', 'EOSBULLBUSD', 'EOSBEARUSDT', 'EOSBEARBUSD', 'XRPBULLUSDT', 'XRPBULLBUSD', 'XRPBEARUSDT', 'XRPBEARBUSD', 'BATBUSD', 'ENJBUSD', 'NANOBUSD', 'ONTBUSD', 'RVNBUSD', 'STRATBUSD', 'STRATBNB', 'STRATUSDT', 'AIONBUSD', 'AIONUSDT', 'MBLBNB', 'MBLBTC', 'MBLUSDT', 'COTIBNB', 'COTIBTC', 'COTIUSDT', 'ALGOBUSD', 'BTTBUSD', 'TOMOBUSD', 'XMRBUSD', 'ZECBUSD', 'BNBBULLUSDT', 'BNBBULLBUSD', 'BNBBEARUSDT', 'BNBBEARBUSD', 'STPTBNB', 'STPTBTC', 'STPTUSDT', 'BTCZAR', 'ETHZAR', 'BNBZAR', 'USDTZAR', 'BUSDZAR', 'BTCBKRW', 'ETHBKRW', 'BNBBKRW', 'WTCUSDT', 'DATABUSD', 'DATAUSDT', 'XZCUSDT', 'SOLBNB', 'SOLBTC', 'SOLUSDT', 'SOLBUSD', 'BTCIDRT', 'BNBIDRT', 'USDTIDRT', 'BUSDIDRT', 'CTSIBTC', 'CTSIUSDT', 'CTSIBNB', 'CTSIBUSD', 'HIVEBNB', 'HIVEBTC', 'HIVEUSDT', 'CHRBNB', 'CHRBTC', 'CHRUSDT', 'BTCUPUSDT', 'BTCDOWNUSDT', 'GXSUSDT', 'ARDRUSDT', 'ERDBUSD', 'LENDUSDT', 'HBARBUSD', 'MATICBUSD', 'WRXBUSD', 'ZILBUSD', 'MDTBNB', 'MDTBTC', 'MDTUSDT', 'STMXBNB', 'STMXBTC', 'STMXETH', 'STMXUSDT', 'KNCBUSD', 'KNCUSDT', 'REPBUSD', 'REPUSDT', 'LRCBUSD', 'LRCUSDT', 'IQBNB', 'IQBUSD', 'PNTBTC', 'PNTUSDT', 'BTCGBP', 'ETHGBP', 'XRPGBP', 'BNBGBP', 'GBPBUSD', 'DGBBNB', 'DGBBTC', 'DGBBUSD', 'BTCUAH', 'USDTUAH', 'COMPBTC', 'COMPBNB', 'COMPBUSD', 'COMPUSDT', 'BTCBIDR', 'ETHBIDR', 'BNBBIDR', 'BUSDBIDR', 'USDTBIDR', 'BKRWUSDT', 'BKRWBUSD', 'SCUSDT', 'ZENUSDT', 'SXPBTC', 'SXPBNB', 'SXPBUSD', 'SNXBTC', 'SNXBNB', 'SNXBUSD', 'SNXUSDT', 'ETHUPUSDT', 'ETHDOWNUSDT', 'ADAUPUSDT', 'ADADOWNUSDT', 'LINKUPUSDT', 'LINKDOWNUSDT', 'VTHOBNB', 'VTHOBUSD', 'VTHOUSDT', 'DCRBUSD', 'DGBUSDT', 'GBPUSDT', 'STORJBUSD', 'SXPUSDT', 'IRISBNB', 'IRISBTC', 'IRISBUSD', 'MKRBNB', 'MKRBTC', 'MKRUSDT', 'MKRBUSD', 'DAIBNB', 'DAIBTC', 'DAIUSDT', 'DAIBUSD', 'RUNEBNB', 'RUNEBTC', 'RUNEBUSD', 'MANABUSD', 'DOGEBUSD', 'LENDBUSD', 'ZRXBUSD', 'DCRUSDT', 'STORJUSDT', 'XRPBKRW', 'ADABKRW', 'BTCAUD', 'ETHAUD', 'AUDBUSD', 'FIOBNB', 'FIOBTC', 'FIOBUSD', 'BNBUPUSDT', 'BNBDOWNUSDT', 'XTZUPUSDT', 'XTZDOWNUSDT', 'AVABNB', 'AVABTC', 'AVABUSD', 'USDTBKRW', 'BUSDBKRW', 'IOTABUSD', 'MANAUSDT', 'XRPAUD', 'BNBAUD', 'AUDUSDT', 'BALBNB', 'BALBTC', 'BALBUSD', 'YFIBNB', 'YFIBTC', 'YFIBUSD', 'YFIUSDT', 'BLZBUSD', 'KMDBUSD', 'BALUSDT', 'BLZUSDT', 'IRISUSDT', 'KMDUSDT', 'BTCDAI', 'ETHDAI', 'BNBDAI', 'USDTDAI', 'BUSDDAI', 'JSTBNB', 'JSTBTC', 'JSTBUSD', 'JSTUSDT', 'SRMBNB', 'SRMBTC', 'SRMBUSD', 'SRMUSDT', 'ANTBNB', 'ANTBTC', 'ANTBUSD', 'ANTUSDT', 'CRVBNB', 'CRVBTC', 'CRVBUSD', 'CRVUSDT', 'SANDBNB', 'SANDBTC', 'SANDUSDT', 'SANDBUSD', 'OCEANBNB', 'OCEANBTC', 'OCEANBUSD', 'OCEANUSDT', 'NMRBNB', 'NMRBTC', 'NMRBUSD', 'NMRUSDT', 'DOTBNB', 'DOTBTC', 'DOTBUSD', 'DOTUSDT', 'LUNABNB', 'LUNABTC', 'LUNABUSD', 'LUNAUSDT', 'IDEXBTC', 'IDEXBUSD', 'RSRBNB', 'RSRBTC', 'RSRBUSD', 'RSRUSDT', 'PAXGBNB', 'PAXGBTC', 'PAXGBUSD', 'PAXGUSDT', 'WNXMBNB', 'WNXMBTC', 'WNXMBUSD', 'WNXMUSDT', 'TRBBNB', 'TRBBTC', 'TRBBUSD', 'TRBUSDT', 'ETHNGN', 'DOTBIDR', 'LINKAUD', 'SXPAUD', 'BZRXBNB', 'BZRXBTC', 'BZRXBUSD', 'BZRXUSDT', 'WBTCBTC', 'WBTCETH', 'SUSHIBNB', 'SUSHIBTC', 'SUSHIBUSD', 'SUSHIUSDT', 'YFIIBNB', 'YFIIBTC', 'YFIIBUSD', 'YFIIUSDT', 'KSMBNB', 'KSMBTC', 'KSMBUSD', 'KSMUSDT', 'EGLDBNB', 'EGLDBTC', 'EGLDBUSD', 'EGLDUSDT', 'DIABNB', 'DIABTC', 'DIABUSD', 'DIAUSDT', 'RUNEUSDT', 'FIOUSDT', 'UMABTC', 'UMAUSDT', 'EOSUPUSDT', 'EOSDOWNUSDT', 'TRXUPUSDT', 'TRXDOWNUSDT', 'XRPUPUSDT', 'XRPDOWNUSDT', 'DOTUPUSDT', 'DOTDOWNUSDT', 'SRMBIDR', 'ONEBIDR', 'LINKTRY', 'USDTNGN', 'BELBNB', 'BELBTC', 'BELBUSD', 'BELUSDT', 'WINGBNB', 'WINGBTC', 'SWRVBNB', 'SWRVBUSD', 'WINGBUSD', 'WINGUSDT', 'LTCUPUSDT', 'LTCDOWNUSDT', 'LENDBKRW', 'SXPEUR', 'CREAMBNB', 'CREAMBUSD', 'UNIBNB', 'UNIBTC', 'UNIBUSD', 'UNIUSDT', 'NBSBTC', 'NBSUSDT', 'OXTBTC', 'OXTUSDT', 'SUNBTC', 'SUNUSDT', 'AVAXBNB', 'AVAXBTC', 'AVAXBUSD', 'AVAXUSDT', 'HNTBTC', 'HNTUSDT', 'BAKEBNB', 'BURGERBNB', 'SXPBIDR', 'LINKBKRW', 'FLMBNB', 'FLMBTC', 'FLMBUSD', 'FLMUSDT', 'SCRTBTC', 'SCRTETH', 'CAKEBNB', 'CAKEBUSD', 'SPARTABNB', 'UNIUPUSDT', 'UNIDOWNUSDT', 'ORNBTC', 'ORNUSDT', 'TRXNGN', 'SXPTRY', 'UTKBTC', 'UTKUSDT', 'XVSBNB', 'XVSBTC', 'XVSBUSD', 'XVSUSDT', 'ALPHABNB', 'ALPHABTC', 'ALPHABUSD', 'ALPHAUSDT', 'VIDTBTC', 'VIDTBUSD', 'AAVEBNB', 'BTCBRL', 'USDTBRL', 'AAVEBTC', 'AAVEETH', 'AAVEBUSD', 'AAVEUSDT', 'AAVEBKRW', 'NEARBNB', 'NEARBTC', 'NEARBUSD', 'NEARUSDT', 'SXPUPUSDT', 'SXPDOWNUSDT', 'DOTBKRW', 'SXPGBP', 'FILBNB', 'FILBTC', 'FILBUSD', 'FILUSDT', 'FILUPUSDT', 'FILDOWNUSDT', 'YFIUPUSDT', 'YFIDOWNUSDT', 'INJBNB', 'INJBTC', 'INJBUSD', 'INJUSDT', 'AERGOBTC', 'AERGOBUSD', 'LINKEUR', 'ONEBUSD', 'EASYETH', 'AUDIOBTC', 'AUDIOBUSD', 'AUDIOUSDT', 'CTKBNB', 'CTKBTC', 'CTKBUSD', 'CTKUSDT', 'BCHUPUSDT', 'BCHDOWNUSDT', 'BOTBTC', 'BOTBUSD', 'ETHBRL', 'DOTEUR', 'AKROBTC', 'AKROUSDT', 'KP3RBNB', 'KP3RBUSD', 'AXSBNB', 'AXSBTC', 'AXSBUSD', 'AXSUSDT', 'HARDBNB', 'HARDBTC', 'HARDBUSD', 'HARDUSDT', 'BNBBRL', 'LTCEUR', 'RENBTCBTC', 'RENBTCETH', 'DNTBUSD', 'DNTUSDT', 'SLPETH', 'ADAEUR', 'LTCNGN', 'CVPETH', 'CVPBUSD', 'STRAXBTC', 'STRAXETH', 'STRAXBUSD', 'STRAXUSDT', 'FORBTC', 'FORBUSD', 'UNFIBNB', 'UNFIBTC', 'UNFIBUSD', 'UNFIUSDT', 'FRONTETH', 'FRONTBUSD', 'BCHABUSD', 'ROSEBTC', 'ROSEBUSD', 'ROSEUSDT', 'AVAXTRY', 'BUSDBRL', 'AVAUSDT', 'SYSBUSD', 'XEMUSDT', 'HEGICETH', 'HEGICBUSD', 'AAVEUPUSDT', 'AAVEDOWNUSDT', 'PROMBNB', 'PROMBUSD', 'XRPBRL', 'XRPNGN', 'SKLBTC', 'SKLBUSD', 'SKLUSDT', 'BCHEUR', 'YFIEUR', 'ZILBIDR', 'SUSDBTC', 'SUSDETH', 'SUSDUSDT', 'COVERETH', 'COVERBUSD', 'GLMBTC', 'GLMETH', 'GHSTETH', 'GHSTBUSD', 'SUSHIUPUSDT', 'SUSHIDOWNUSDT', 'XLMUPUSDT', 'XLMDOWNUSDT', 'LINKBRL', 'LINKNGN', 'LTCRUB', 'TRXTRY', 'XLMEUR', 'DFETH', 'DFBUSD', 'GRTBTC', 'GRTETH', 'GRTUSDT', 'JUVBTC', 'JUVBUSD', 'JUVUSDT', 'PSGBTC', 'PSGBUSD', 'PSGUSDT', 'BUSDBVND', 'USDTBVND', '1INCHBTC', '1INCHUSDT', 'REEFBTC', 'REEFUSDT', 'OGBTC', 'OGUSDT', 'ATMBTC', 'ATMUSDT', 'ASRBTC', 'ASRUSDT', 'CELOBTC', 'CELOUSDT', 'RIFBTC', 'RIFUSDT', 'CHZTRY', 'XLMTRY', 'LINKGBP', 'GRTEUR', 'BTCSTBTC', 'BTCSTBUSD', 'BTCSTUSDT', 'TRUBTC', 'TRUBUSD', 'TRUUSDT', 'DEXEETH', 'DEXEBUSD', 'EOSEUR', 'LTCBRL', 'USDCBUSD', 'TUSDBUSD', 'PAXBUSD', 'CKBBTC', 'CKBBUSD', 'CKBUSDT', 'TWTBTC', 'TWTBUSD', 'TWTUSDT', 'FIROBTC', 'FIROETH', 'FIROUSDT', 'BETHETH', 'DOGEEUR', 'DOGETRY', 'DOGEAUD', 'DOGEBRL', 'DOTNGN', 'PROSETH', 'LITBTC', 'LITBUSD', 'LITUSDT', 'BTCVAI', 'BUSDVAI', 'SFPBTC', 'SFPBUSD', 'SFPUSDT', 'DOGEGBP', 'DOTTRY', 'FXSBTC', 'FXSBUSD', 'DODOBTC', 'DODOBUSD', 'DODOUSDT', 'FRONTBTC', 'EASYBTC', 'CAKEBTC', 'CAKEUSDT', 'BAKEBUSD', 'UFTETH', 'UFTBUSD', '1INCHBUSD', 'BANDBUSD', 'GRTBUSD', 'IOSTBUSD', 'OMGBUSD', 'REEFBUSD', 'ACMBTC', 'ACMBUSD', 'ACMUSDT', 'AUCTIONBTC', 'AUCTIONBUSD', 'PHABTC', 'PHABUSD', 'DOTGBP', 'ADATRY', 'ADABRL', 'ADAGBP', 'TVKBTC', 'TVKBUSD', 'BADGERBTC', 'BADGERBUSD', 'BADGERUSDT', 'FISBTC', 'FISBUSD', 'FISUSDT', 'DOTBRL', 'ADAAUD', 'HOTTRY', 'EGLDEUR', 'OMBTC', 'OMBUSD', 'OMUSDT', 'PONDBTC', 'PONDBUSD', 'PONDUSDT', 'DEGOBTC', 'DEGOBUSD', 'DEGOUSDT', 'AVAXEUR', 'BTTTRY', 'CHZBRL', 'UNIEUR', 'ALICEBTC', 'ALICEBUSD', 'ALICEUSDT', 'CHZBUSD', 'CHZEUR', 'CHZGBP', 'BIFIBNB', 'BIFIBUSD', 'LINABTC', 'LINABUSD', 'LINAUSDT', 'ADARUB', 'ENJBRL', 'ENJEUR', 'MATICEUR', 'NEOTRY', 'PERPBTC', 'PERPBUSD', 'PERPUSDT', 'RAMPBTC', 'RAMPBUSD', 'RAMPUSDT', 'SUPERBTC', 'SUPERBUSD', 'SUPERUSDT', 'CFXBTC', 'CFXBUSD', 'CFXUSDT', 'ENJGBP', 'EOSTRY', 'LTCGBP', 'LUNAEUR', 'RVNTRY', 'THETAEUR', 'XVGBUSD', 'EPSBTC', 'EPSBUSD', 'EPSUSDT', 'AUTOBTC', 'AUTOBUSD', 'AUTOUSDT', 'TKOBTC', 'TKOBIDR', 'TKOBUSD', 'TKOUSDT', 'PUNDIXETH', 'PUNDIXUSDT', 'BTTBRL', 'BTTEUR', 'HOTEUR', 'WINEUR', 'TLMBTC', 'TLMBUSD', 'TLMUSDT', '1INCHUPUSDT', '1INCHDOWNUSDT', 'BTGBUSD', 'BTGUSDT', 'HOTBUSD', 'BNBUAH', 'ONTTRY', 'VETEUR', 'VETGBP', 'WINBRL', 'MIRBTC', 'MIRBUSD', 'MIRUSDT', 'BARBTC', 'BARBUSD', 'BARUSDT', 'FORTHBTC', 'FORTHBUSD', 'FORTHUSDT', 'CAKEGBP', 'DOGERUB', 'HOTBRL', 'WRXEUR', 'EZBTC', 'EZETH', 'BAKEUSDT', 'BURGERBUSD', 'BURGERUSDT', 'SLPBUSD', 'SLPUSDT', 'TRXAUD', 'TRXEUR', 'VETTRY', 'SHIBUSDT', 'SHIBBUSD', 'ICPBTC', 'ICPBNB', 'ICPBUSD', 'ICPUSDT', 'BTCGYEN', 'USDTGYEN', 'SHIBEUR', 'SHIBRUB', 'ETCEUR', 'ETCBRL', 'DOGEBIDR', 'ARBTC', 'ARBNB', 'ARBUSD', 'ARUSDT', 'POLSBTC', 'POLSBNB', 'POLSBUSD', 'POLSUSDT', 'MDXBTC', 'MDXBNB', 'MDXBUSD', 'MDXUSDT', 'MASKBNB', 'MASKBUSD', 'MASKUSDT', 'LPTBTC', 'LPTBNB', 'LPTBUSD', 'LPTUSDT', 'ETHUAH', 'MATICBRL', 'SOLEUR', 'SHIBBRL', 'AGIXBTC', 'ICPEUR', 'MATICGBP', 'SHIBTRY', 'MATICBIDR', 'MATICRUB', 'NUBTC', 'NUBNB', 'NUBUSD', 'NUUSDT', 'XVGUSDT', 'RLCBUSD', 'CELRBUSD', 'ATMBUSD', 'ZENBUSD', 'FTMBUSD', 'THETABUSD', 'WINBUSD', 'KAVABUSD', 'XEMBUSD', 'ATABTC', 'ATABNB', 'ATABUSD', 'ATAUSDT', 'GTCBTC', 'GTCBNB', 'GTCBUSD', 'GTCUSDT', 'TORNBTC', 'TORNBNB', 'TORNBUSD', 'TORNUSDT', 'MATICTRY', 'ETCGBP', 'SOLGBP', 'BAKEBTC', 'COTIBUSD', 'KEEPBTC', 'KEEPBNB', 'KEEPBUSD', 'KEEPUSDT', 'SOLTRY', 'RUNEGBP', 'SOLBRL', 'SCBUSD', 'CHRBUSD', 'STMXBUSD', 'HNTBUSD', 'FTTBUSD', 'DOCKBUSD', 'ADABIDR', 'ERNBNB', 'ERNBUSD', 'ERNUSDT', 'KLAYBTC', 'KLAYBNB', 'KLAYBUSD', 'KLAYUSDT', 'RUNEEUR', 'MATICAUD', 'DOTRUB', 'UTKBUSD', 'IOTXBUSD', 'PHAUSDT', 'SOLRUB', 'RUNEAUD', 'BUSDUAH', 'BONDBTC', 'BONDBNB', 'BONDBUSD', 'BONDUSDT', 'MLNBTC', 'MLNBNB', 'MLNBUSD', 'MLNUSDT'],
      rules: {
        token: [
          { required: true, message: 'Please select a token', trigger: 'blur' }
        ],
        symbol: [
          { required: true, message: 'Please input symbol', trigger: 'blur' }
        ],
        margin: [
          { required: true, message: 'Please input margin', trigger: 'blur' }
        ],
        deposit: [
          { required: true, message: 'Please input deposit', trigger: 'blur' }
        ],
        expiry: [
          { required: true, message: 'Please choose your expiry', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              const date = new Date()
              const timestamp = date.getTime() + 10 * 60 * 1000
              if (timestamp < value) {
                callback()
              } else {
                callback(new Error('Expiry time must be at least ten minutes later'))
              }
            },
            trigger: 'blur'
          }
        ],
        threshold: [
          { required: true, message: 'Please choose your threshold', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              const date = new Date()
              const timestamp = date.getTime() + 5 * 60 * 1000
              if (timestamp > value) {
                callback(new Error('Threshold must be set before expiry and at least five minutes later'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        strike: [
          { required: true, message: 'Please enter strike price', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,6})$/
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('Please enter a price with less than 6 decimal places.'))
              }
            },
            trigger: 'blur'
          }
        ],
        description: [
          { required: true, message: 'Please enter the description', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.symbolsList = this.symbols.map(symbol => {
      return { value: symbol, label: symbol }
    })
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.symbolsList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmCreation()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async poolInit() {
      const token = this.form.token
      const symbol = this.form.symbol
      const json_filter = '$[-1:]..p'
      const margin = this.form.margin
      const expiry = this.form.expiry
      const threshold = this.form.threshold
      const url = `https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&startTime=${expiry - 1000}&endTime=${expiry}`
      const deposit = this.form.deposit
      const strike = this.form.strike
      const des = this.form.description
      const neo3Dapi = window.neo3Dapi_save
      try {
        const runnable = await test_pool_init(token, url, json_filter, margin, expiry, threshold, deposit, strike, des, neo3Dapi)
        if (runnable.state) {
          const response = await pool_init(token, url, json_filter, margin, expiry, threshold, deposit, strike, des, neo3Dapi)
          console.log(response)
          return response
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
      console.log()
    },

    confirmCreation() {
      this.$confirm('You will be charged the amount of deposit entered (refundable), plus any system / network fee incurred.', 'Confirm creation of pool?', {
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
          this.poolInit().then((val) => {
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
          message: 'You have cancelled the transaction.'
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.title{
  font-size: 20px;
}
</style>

