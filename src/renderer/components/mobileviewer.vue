<template>
  <div class="pane" style="overflow-y: hidden">
    <webview class="pane-mini sidebar" useragent="miniUserAgent"
    id="minibrowser" :src="content.originalLink" style="display:inline-flex; width: 100%; height: 100%;" :class="{inverted: lightsout}"></webview>
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
    lightsout: {
      get () {
        return this.$store.getters.getLightsOutState
      }
    },
    miniUserAgent: {
      get () {
        if (this.content.originalLink.includes('youtube.com')) {
          return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
        } else {
          return 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25'
        }
      }
    }
  },
  mounted () {
    var webview = document.querySelector('#minibrowser')
    let _this = this

    webview.addEventListener('did-get-response-details', function () {
      webview.insertCSS('html{ filter: grayscale(100%);} ::-webkit-scrollbar {width: 5px;} ::-webkit-scrollbar-track {background: #ddd;} ::-webkit-scrollbar-thumb {background: #d66;}')
    })

    webview.addEventListener('enter-html-full-screen', function () {
      if (_this.$store.getters.getMobileViewLinkState) {
        _this.$store.dispatch('toggleMobileLinkState')
      }
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
</style>
