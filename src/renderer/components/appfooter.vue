<template>
  <footer class="toolbar toolbar-footer">
    <div class="toolbar-actions">
      <button v-if='!BUSY_FETCHINGARTICLES' class="btn btn-primary pull-right" @click='forceArticleRefresh'>
        Refresh
      </button>
      <button v-if='BUSY_FETCHINGARTICLES' class="btn btn-warning pull-right" disabled>Fetching</button>
    </div>
  </footer>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'appfooter',
  computed: {
    BUSY_FETCHINGARTICLES: {
      get () {
        return this.$store.getters.getBusyFetchingArticles
      }
    }
  },
  methods: {
    forceArticleRefresh: function () {
      ipcRenderer.send('GLOBAL_FETCH_ARTICLES')
    }
  },
  mounted () {
    this.$store.dispatch('checkIfBackendIsBusyFetchingArticles')
    ipcRenderer.send('GLOBAL_FETCH_ARTICLES')
  }
}
</script>

<style scoped>
</style>
