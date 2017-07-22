<template>
  <div class="window">
    <topbar></topbar>

    <div class="window-content">
      <div class="pane-group">
        <feedsidebar></feedsidebar>

        <articles></articles>

        <unfluffviewer></unfluffviewer>
        
        <mobileviewer v-if="mobileStateView"></mobileviewer>
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
// import dojoviewer from './dojoviewer'

export default {
  name: 'mainwindow',
  components: { feedsidebar, appfooter, articles, unfluffviewer, mobileviewer, topbar },
  computed: {
    mobileStateView: {
      get () {
        return this.$store.getters.getMobileViewState
      }
    }
  }
}
</script>

<style scoped>
</style>
