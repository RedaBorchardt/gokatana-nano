<template>
  <div class="pane" style="overflow-y: hidden;">
    <webview
    class="pane-mini sidebar" id="gtopic" :src="searchLink" style="display:inline-flex; width: 100%; height: 100%" css="html {filter: grayscale(100%);} #header_wrapper {display: none !important;}"></webview>
  </div>
</template>

<script>
export default {
  name: 'googleexplorer',
  data: function () {
    return {
      cachedLink: {}
    }
  },
  computed: {
    searchLink: function () {
      let searchString = ''
      if (this.$store.getters.getGTopicViewLinkState) {
        this.cachedLink = this.getActiveContentTitle
        if (this.getGTopicMode === 'Google') {
          searchString = 'https://www.google.co.uk/search?q=' + this.getActiveContentTitle + '&tbm=nws'
        } else {
          searchString = 'http://duckduckgo.com/?q=' + this.getActiveContentTitle + ''
        }
        return searchString
      } else {
        if (this.getGTopicMode === 'Google') {
          searchString = 'https://www.google.co.uk/search?q=' + this.cachedLink + '&tbm=nws'
        } else {
          searchString = 'http://duckduckgo.com/?q=' + this.cachedLink + ''
        }
        return searchString
      }
    },
    getActiveContentTitle: function () {
      return this.$store.getters.getContentInView.title
    },
    getGTopicMode: function () {
      return this.$store.getters.getGTopicMode
    }
  },
  mounted () {
    const {shell} = require('electron')
    var webviewGtopic = document.querySelector('#gtopic')

    webviewGtopic.addEventListener('did-get-response-details', function () {
      webviewGtopic.insertCSS('html{filter: grayscale(100%);}')
      if (!webviewGtopic.getURL().includes('duckduckgo.com') && !webviewGtopic.getURL().includes('youtube.com')) {
        webviewGtopic.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25')
      } else {
        webviewGtopic.setUserAgent('')
      }
    })
    webviewGtopic.addEventListener('will-navigate', (e) => {
      const protocol = require('url').parse(e.url).protocol
      if (!e.url.includes('duckduckgo.com')) {
        if (protocol === 'http:' || protocol === 'https:') {
          shell.openExternal(e.url)
        }
        webviewGtopic.stop()
      }
    })
  }
}
</script>

<style scoped>

</style>
