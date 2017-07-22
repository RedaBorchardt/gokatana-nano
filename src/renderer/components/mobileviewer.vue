<template>
  <div class="pane" style="overflow-y: hidden">
    <webview useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25"
    class="pane-mini sidebar" id="minibrowser" :src="content.originalLink" style="display:inline-flex; width: 100%; height: 100%" css="html {filter: grayscale(100%);}"></webview>
  </div>
</template>

<script>
export default {
  name: 'mobileviewer',
  computed: {
    content: {
      get () {
        if (this.$store.getters.getMobileViewLinkState) {
          return this.$store.getters.getContentInView
        }
      }
    }
  },
  mounted () {
    var webview = document.querySelector('#minibrowser')

    webview.addEventListener('did-get-response-details', function () {
      webview.insertCSS('html{ filter: grayscale(100%);}')
    })
  }
}
</script>

<style scoped>
</style>
