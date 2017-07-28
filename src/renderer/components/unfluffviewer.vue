<template>
  <div class='pane scroll' style='max-width:600px;' :class="{hidescrollbar: forcedMiniBrowserShow}">
    <div class='padded-more' v-if="!forcedMiniBrowserShow">
      <img v-if="content.image" style='width: 100%' :src="content.image">
      <h4 style='white-space: pre-line;'>{{content.title}}</h4>
    <p style='white-space: pre-line; font-size: 1.2em;' v-html="content.text">
      </p>
      <p v-html="content.copyright"></p>
    </div>
    <forcedminibrowser v-if='forcedMiniBrowserShow' :url="content.originalLink"></forcedminibrowser>
  </div>
</template>

<script>
import forcedminibrowser from './forcedminibrowser'

export default {
  name: 'unfluffviewer',
  components: { forcedminibrowser },
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
    forcedMiniBrowserShow: {
      get () {
        return this.$store.getters.getForcedMiniBrowserState
      }
    }
  }
}
</script>

<style scoped>
.scroll::-webkit-scrollbar {
  width: 5px;
}

.scroll::-webkit-scrollbar-track {
  background: #ddd;
}

.scroll::-webkit-scrollbar-thumb {
  background: #d66;
}
</style>
