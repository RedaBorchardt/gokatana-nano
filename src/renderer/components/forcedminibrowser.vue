<template>
  <div style="height:100%; overflow-y: hidden;">
    <webview useragent="useragent"
    class="pane-mini sidebar" id="forcedmini" :src="url" style="display:inline-flex; width: 100%; height: 100%" :class="{inverted: lightsout}"></webview>
  </div>
</template>

<script>
export default {
  name: 'forcedminibrowser',
  props: ['url'],
  computed: {
    lightsout: {
      get () {
        return this.$store.getters.getLightsOutState
      }
    }
  },
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
.inverted {
  filter: invert(100%)
}

.hidescrollbar {
  overflow-y: hidden;
}
</style>
