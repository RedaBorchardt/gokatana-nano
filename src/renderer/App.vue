<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'

  export default {
    name: 'gokatana-nano',
    mounted () {
      let _this = this
      let updateOnlineStatus = function () {
        ipcRenderer.send('ONLINE_STATUS_CHANGED', navigator.onLine ? 'online' : 'offline')
        _this.$store.dispatch('checkIfApplicationIsOnline')
      }
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
      updateOnlineStatus()
    }
  }
</script>

<style>
  @import url('~@/photon/css/photon.css');
  /* CSS */
</style>
