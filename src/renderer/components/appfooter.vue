<template>
  <footer class="toolbar toolbar-footer">
    <div class="toolbar-actions">
      <button v-if='!BUSY_FETCHINGARTICLES && ONLINE_STATUS' class="btn btn-primary pull-right" @click='forceArticleRefresh'>
        Refresh
      </button>
      <button v-if='BUSY_FETCHINGARTICLES && ONLINE_STATUS' class="btn btn-warning pull-right" disabled>Fetching</button>
      <button v-if='!ONLINE_STATUS' class="btn btn-error pull-right" disabled>Offline</button>
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
    },
    ONLINE_STATUS: {
      get () {
        if (this.$store.getters.getOnlineStatus === 'online') {
          return true
        } else {
          return false
        }
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
    this.$store.dispatch('checkIfApplicationIsOnline')
    ipcRenderer.send('GLOBAL_FETCH_ARTICLES')
  }
}
</script>

<style scoped>
</style>
