<template>
  <div class="pane" style="overflow-y: hidden">
    <webview v-bind:useragent="miniuseragent"
    class="pane-mini sidebar" id="minibrowser" :src="content.originalLink" style="display:inline-flex; width: 100%; height: 100%" css="html {filter: grayscale(100%);}"></webview>
  </div>
</template>

<script>
export default {
  name: 'mobileviewer',
  data: function () {
    return {
      cachedContent: {}
    }
  },
  computed: {
    content: {
      get () {
        if (this.$store.getters.getMobileViewLinkState) {
          this.cachecContent = JSON.parse(JSON.stringify(this.$store.getters.getContentInView))
          return this.$store.getters.getContentInView
        } else {
          return this.cachedContent
        }
      }
    },
    miniuseragent: {
      get () {
        if (this.$store.getters.getMobileViewLinkState) {
          if (this.content.miniuseragent !== 'standard') {
            return this.content.miniuseragent
          } else {
            return 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25'
          }
        }
      }
    }
  },
  mounted () {
    var webview = document.querySelector('#minibrowser')
    let _this = this

    webview.addEventListener('did-get-response-details', function () {
      webview.insertCSS('html{ filter: grayscale(100%);}')
    })

    webview.addEventListener('enter-html-full-screen', function () {
      if (_this.$store.getters.getMobileViewLinkState) {
        _this.$store.dispatch('toggleMobileLinkState')
      }
      require('electron').remote.getCurrentWindow().setFullScreen(false)
    })
  }
}
</script>

<style scoped>
</style>
