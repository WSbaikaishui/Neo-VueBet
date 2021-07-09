<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper" >
          <el-button v-if="!neo3Dapi" type="primary" @click="wallet()">Connect to Neo </el-button>
          <el-tag  v-else type="success"  effect="dark" >Connected  </el-tag>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
          </router-link>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import neo3 from '../../api/ops'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      neo3Dapi: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  created() {
    this.neo3Dapi = neo3.neo3Dapi_save
  },

  methods: {

    async wallet() {
      let initResult

      function init() {
        return new Promise((resovle, reject) => {
          function onReady() {
            if (!window.NEOLineN3) { return }
            const neo3Dapi = new window.NEOLineN3.Init()
            return resovle({ neo3Dapi })
          }
          onReady()
          window.addEventListener('NEOLine.N3.EVENT.READY', onReady)
          setTimeout(() => {
            reject(new Error('neoline not installed!'))
          }, 3000)
        })
      }
      function getNeoDapiInstances() {
        if (!initResult) {
          initResult = init()
        }
        return initResult
      }
      try {
        const neo3Dapi = (await getNeoDapiInstances()).neo3Dapi
        await (this.neo3Dapi = await neo3Dapi)
        await (neo3.neo3Dapi_save = await neo3Dapi)
        this.$message({
          type: 'success',
          message: '连接成功'
        })
      } catch (e) {
        this.$message.error('You have rejected the request to connect with your dApp')
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 50px;

      .avatar-wrapper {
        margin-top: 1px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
