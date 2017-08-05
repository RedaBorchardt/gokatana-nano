<template>
  <div class="window">
    <topbar></topbar>

    <div class="window-content">
      <div class="pane-group">
        <options v-if="optionsMode"></options>
        <template v-if="!optionsMode">
          <feedsidebar v-if="bladeStateView"></feedsidebar>
          <articles v-if="headlineStateView"></articles>

          <unfluffviewer v-if="katanaStateView"></unfluffviewer>

          <mobileviewer v-if="mobileStateView"></mobileviewer>

          <googleexplorer v-if="gtopicStateView"></googleexplorer>
        </template>
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
import options from './options'
// import dojoviewer from './dojoviewer'

export default {

  name: 'mainwindow',
  components: { options, feedsidebar, appfooter, articles, unfluffviewer, mobileviewer, topbar, googleexplorer },
  computed: {
    optionsMode: {
      get () {
        return this.$store.getters.getOptionsMode
      }
    },
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
  },
  mounted () {
    require('electron').remote.getCurrentWindow().on('enter-full-screen', (e, cmd) => {
      this.$store.commit('ORIGINAL_FULLSCREEN_STATE', true)
      this.$store.commit('SET_FULLSCREEN_STATE', true)
    })

    require('electron').remote.getCurrentWindow().on('leave-full-screen', (e, cmd) => {
      this.$store.commit('ORIGINAL_FULLSCREEN_STATE', false)
      this.$store.commit('SET_FULLSCREEN_STATE', false)
    })
  }
}
</script>

<style scoped>

</style>
