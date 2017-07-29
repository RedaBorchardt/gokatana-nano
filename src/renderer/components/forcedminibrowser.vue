<template>
  <div style="height:100%; overflow-y: hidden;">
    <webview useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25"
    class="pane-mini sidebar" id="forcedmini" :src="url" style="display:inline-flex; width: 100%; height: 100%"></webview>
  </div>
</template>

<script>
export default {
  name: 'forcedminibrowser',
  props: ['url'],
  mounted () {
    var webview = document.querySelector('#forcedmini')
    let _this = this

    webview.addEventListener('did-get-response-details', function () {
      webview.insertCSS('::-webkit-scrollbar {width: 5px;} ::-webkit-scrollbar-track {background: #ddd;} ::-webkit-scrollbar-thumb {background: #d66;}')
    })

    webview.addEventListener('enter-html-full-screen', function () {
      require('electron').remote.getCurrentWindow().setFullScreen(false)
    })

    webview.addEventListener('enter-html-full-screen', function () {
      _this.$store.dispatch('toggleFullScreenFromVideo')
    })

    webview.addEventListener('leave-html-full-screen', function () {
      _this.$store.dispatch('toggleFullScreenFromVideo')
    })
  },
  updated () {
    this.$el.scrollTop = 0
  }
}
</script>

<style scoped>
.hidescrollbar {
  overflow-y: hidden;
}
</style>
