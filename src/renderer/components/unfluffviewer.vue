<template>
  <div class='pane' style='max-width:600px;' :class="{hidescrollbar: forcedMiniBrowser}">
    <div class='padded-more' v-if="!forcedMiniBrowser">
      <img style='width: 100%' :src="content.image">
      <h4 style='white-space: pre-line;'>{{content.title}}</h4>
    <p style='white-space: pre-line; font-size: 1.2em;' v-html="content.text">
      </p>
      <p v-html="content.copyright"></p>
    </div>
    <webview v-if="forcedMiniBrowser" useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25"
    class="pane-mini sidebar" id="foo" :src="content.originalLink" style="display:inline-flex; width: 100%; height: 100%" css="html {filter: grayscale(100%);}"></webview>
  </div>
</template>

<script>
export default {
  name: 'unfluffviewer',
  computed: {
    content: {
      get () {
        if (this.$store.getters.getContentInView.displaystrategy === 'minioverride') {
          if (!this.$store.getters.getForcedMiniBrowserState) {
            this.$store.dispatch('toggleForcedMiniBrowser')
          }
        } else {
          if (this.$store.getters.getForcedMiniBrowserState) {
            this.$store.dispatch('toggleForcedMiniBrowser')
          }
        }
        return this.$store.getters.getContentInView
      }
    },
    forcedMiniBrowser: {
      get () {
        return this.$store.getters.getForcedMiniBrowserState
      }
    }
  }
}
</script>

<style scoped>
.hidescrollbar {
  overflow-y: hidden;
}
</style>
