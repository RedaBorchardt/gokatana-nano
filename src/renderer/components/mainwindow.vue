<template>
  <div class="window">
    <topbar></topbar>

    <div class="window-content">
      <div class="pane-group">
        <feedsidebar v-if="bladeStateView"></feedsidebar>

        <articles v-if="headlineStateView"></articles>

        <unfluffviewer v-if="katanaStateView"></unfluffviewer>

        <mobileviewer v-if="mobileStateView"></mobileviewer>

        <googleexplorer v-if="gtopicStateView"></googleexplorer>
      </div>
    </div>

    <appfooter></appfooter>
  </div>
</template>

<script>
import feedsidebar from './feedsidebar'
import appfooter from './appfooter'
import articles from './articles'
import unfluffviewer from './unfluffviewer'
import mobileviewer from './mobileviewer'
import topbar from './topbar'
import googleexplorer from './googleexplorer'
// import dojoviewer from './dojoviewer'

export default {
  name: 'mainwindow',
  components: { feedsidebar, appfooter, articles, unfluffviewer, mobileviewer, topbar, googleexplorer },
  computed: {
    mobileStateView: {
      get () {
        return this.$store.getters.getMobileViewState
      }
    },
    katanaStateView: {
      get () {
        return this.$store.getters.getKatanaViewState
      }
    },
    headlineStateView: {
      get () {
        return this.$store.getters.getHeadlineViewerState
      }
    },
    bladeStateView: {
      get () {
        return this.$store.getters.getBladeViewerState
      }
    },
    gtopicStateView: {
      get () {
        return this.$store.getters.getGTopicViewState
      }
    }
  }
}
</script>

<style scoped>
</style>
