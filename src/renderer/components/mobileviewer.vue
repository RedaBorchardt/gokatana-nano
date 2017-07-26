<template>
  <div class="pane" style="overflow-y: hidden">
    <webview class="pane-mini sidebar" id="minibrowser" :src="content.originalLink" style="display:inline-flex; width: 100%; height: 100%" css="html {filter: grayscale(100%);}"></webview>
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
