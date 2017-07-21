<template>
  <footer class="toolbar toolbar-footer">
    <div class="toolbar-actions">
      <span style='line-height: 24px; padding-left: 5px; font-size: 0.9em; color: grey'>{{LOG_MESSAGE.message}}</span>
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
    },
    LOG_MESSAGE: {
      get () {
        return this.$store.getters.getLastLogEntry
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
    this.$store.dispatch('listenForLogFromBackend')
    ipcRenderer.send('GLOBAL_FETCH_ARTICLES')
  }
}
</script>

<style scoped>
</style>
