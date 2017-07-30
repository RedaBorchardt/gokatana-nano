<template>
  <header class="toolbar toolbar-header">
    <div class="toolbar-actions">
      <div class="btn-group" :class="{inverted: lightsout}">
        <button class="btn btn-default" :class="({'active': bladeViewState})" @click='toggleBladeView'>
          <span class="icon icon-flow-cascade icon-text"></span>
          Katana Blades
        </button>
        <button class="btn btn-default" :class="({'active': headlineViewState})" @click='toggleHeadlineView'>
          <span class="icon icon-list icon-text"></span>
          Headlines
        </button>
        <button class="btn btn-default" :class="({'active': katanaViewState})" @click='toggleKatanaView'>
          <span class="icon icon-book-open icon-text"></span>
          Katana View
        </button>
      </div>

      <button v-if="!isfullscreen" class="btn btn-default pull-right" @click='toggleFullScreen'>
        <span class="icon icon-resize-full"></span>
      </button>

      <button v-if="isfullscreen" class="btn btn-default pull-right" @click='toggleFullScreen'>
        <span class="icon icon-resize-small"></span>
      </button>

      <button v-if="isThereLink" class="btn btn-default pull-right" @click='openLinkInBrowser(isThereLink)'>
        <span class="icon icon-export icon-text"></span>
        External Browser
      </button>

      <button class="btn btn-default pull-right" @click='toggleLights'>
        <span class="icon icon-flashlight"></span>
      </button>

      <div class="btn-group">
        <button class="btn" :class="{'btn-positive': mobileLinkState && mobileViewState, 'btn-default': !mobileLinkState && mobileViewState}" @click='toggleMobileLinkState'>
          <span class="icon icon-link" :class="{whiteicon: mobileLinkState && mobileViewState, 'btn-default': !mobileLinkState && mobileViewState}"></span>
        </button>
        <button class="btn" :class="{'btn-positive': mobileViewState, 'btn-default': !mobileViewState}" @click='toggleMobileView'>
          <span class="icon icon-network icon-text" :class='{whiteicon: mobileViewState}'></span>
          Mini Browser
        </button>
      </div>

      <div class="btn-group">
        <button class="btn" :class="{'btn-positive': gtopicLinkState && gtopicViewState, 'btn-default': !gtopicLinkState && gtopicViewState}" @click='toggleGTopicLinkState'>
          <span class="icon icon-link" :class="{whiteicon: gtopicLinkState && gtopicViewState, 'btn-default': !gtopicLinkState && gtopicViewState}"></span>
        </button>
        <button class="btn" :class="{'btn-positive': gtopicViewState, 'btn-default': !gtopicViewState}" @click='toggleGTopicView'>
          <span class="icon icon-network icon-text" :class='{whiteicon: gtopicViewState}'></span>
          Topic Explorer
        </button>
        <button class="btn" :class="{'btn-positive': gtopicViewState, 'btn-default': !gtopicViewState}" @click='toggleGTopicMode' v-if="false">
          {{gtopicMode}}
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { shell } from 'electron'

export default {
  name: 'topbar',
  computed: {
    isThereLink: {
      get () {
        return this.$store.getters.getContentInView.originalLink
      }
    },
    isfullscreen: {
      get () {
        return this.$store.getters.getIsFullscreen
      }
    },
    katanaViewState: {
      get () {
        return this.$store.getters.getKatanaViewState
      }
    },
    headlineViewState: {
      get () {
        return this.$store.getters.getHeadlineViewerState
      }
    },
    mobileViewState: {
      get () {
        return this.$store.getters.getMobileViewState
      }
    },
    mobileLinkState: {
      get () {
        return this.$store.getters.getMobileViewLinkState
      }
    },
    gtopicViewState: {
      get () {
        return this.$store.getters.getGTopicViewState
      }
    },
    gtopicLinkState: {
      get () {
        return this.$store.getters.getGTopicViewLinkState
      }
    },
    gtopicMode: {
      get () {
        return this.$store.getters.getGTopicMode
      }
    },
    bladeViewState: {
      get () {
        return this.$store.getters.getBladeViewerState
      }
    },
    lightsout: {
      get () {
        return this.$store.getters.getLightsOutState
      }
    }
  },
  methods: {
    toggleMobileView () {
      this.$store.dispatch('toggleMobileView')
    },
    toggleMobileLinkState () {
      this.$store.dispatch('toggleMobileLinkState')
    },
    toggleGTopicView () {
      this.$store.dispatch('toggleGTopicView')
    },
    toggleGTopicLinkState () {
      this.$store.dispatch('toggleGTopicLinkState')
    },
    toggleGTopicMode () {
      this.$store.dispatch('toggleGTopicMode')
    },
    toggleKatanaView () {
      this.$store.dispatch('toggleKatanaViewer')
    },
    toggleHeadlineView () {
      this.$store.dispatch('toggleHeadlineViewer')
    },
    toggleBladeView () {
      this.$store.dispatch('toggleBladeViewer')
    },
    toggleFullScreen () {
      this.$store.dispatch('toggleFullScreen')
    },
    openLinkInBrowser (link) {
      shell.openExternal(link)
    },
    toggleLights () {
      let toggled = false
      if (!this.$store.getters.getLightsOutState) {
        this.$store.dispatch('toggleLightsOut')
        document.body.style.filter = 'invert(100%)'
        toggled = true
      }
      if (this.$store.getters.getLightsOutState && !toggled) {
        this.$store.dispatch('toggleLightsOut')
        document.body.style.filter = ''
      }
    }
  }
}
</script>

<style scoped>
.whiteicon {
  color: white;
}

header {
  min-height: 32px;
  max-height: 32px;
}

button {
  height: 24px
}

.inverted {
  filter: invert(100%)
}
</style>
