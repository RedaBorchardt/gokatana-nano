<template>
  <div id='scrollpane' class='pane scroll' style='max-width:600px;' :class="{hidescrollbar: forcedMiniBrowserShow}">
    <div class='padded-more' v-if="!forcedMiniBrowserShow && !showDojo">
      <img v-if="content.image" style='width: 100%' :src="content.image" :class="{inverted: lightsout}">
      <h4 style='white-space: pre-line;-webkit-user-select:text'>{{content.title}}</h4>
    <p style='white-space: pre-line; font-size: 1.2em;-webkit-user-select:text' v-html="content.text">
      </p>
      <p v-html="content.copyright"></p>
    </div>
    <forcedminibrowser v-if='forcedMiniBrowserShow && !showDojo' :url="content.originalLink"></forcedminibrowser>
    <dojoviewer v-if='showDojo'></dojoviewer>
  </div>
</template>

<script>
import forcedminibrowser from './forcedminibrowser'
import dojoviewer from './dojoviewer'

export default {
  name: 'unfluffviewer',
  components: { forcedminibrowser, dojoviewer },
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
    },
    lightsout: {
      get () {
        return this.$store.getters.getLightsOutState
      }
    },
    showDojo: {
      get () {
        return this.$store.getters.getContentInView.contenttype
      }
    }
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
