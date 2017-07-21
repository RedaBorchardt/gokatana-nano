<template>
  <div class="window">
    <header class="toolbar toolbar-header">
      <div class="toolbar-actions">
        <button class="btn btn-default">
          <span class="icon icon-home"></span>
        </button>
        <div class="btn-group">
          <button class="btn btn-default active">
            <span class="icon icon-rss icon-text"></span>
            Direct Feeds
          </button>
          <button class="btn btn-default">
            <span class="icon icon-rocket icon-text"></span>
            Smart Modules
          </button>
          <button class="btn btn-default">
            <span class="icon icon-folder icon-text"></span>
            Custom Views
          </button>
        </div>

        <button class="btn btn-default">
          <span class="icon icon-search icon-text"></span>
          Search
        </button>

        <button class="btn btn-default">
          <span class="icon icon-database icon-text"></span>
          Vault
        </button>

        <button class="btn btn-default btn-dropdown pull-right">
          <span class="icon icon-cog"></span>
        </button>

        <div class="btn-group pull-right">
          <button class="btn btn-default pull-right">
            Text Only
          </button>

          <button class="btn btn-default pull-right">
            Minimal
          </button>

          <button class="btn btn-default pull-right">
            Original
          </button>
        </div>

      </div>
    </header>

    <div class="window-content">
      <div class="pane-group">
        <feedsidebar></feedsidebar>
        <articles></articles>
        <unfluffviewer></unfluffviewer>
        <div class="pane-mini sidebar"></div>
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

export default {
  name: 'mainwindow',
  components: { feedsidebar, appfooter, articles, unfluffviewer },
  mounted () {

  }
}
</script>

<style scoped>
</style>
