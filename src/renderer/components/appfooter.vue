<template>
  <footer class="toolbar toolbar-footer">
    <div class="toolbar-actions">
      <button v-if='!BUSY_BACKEND && !isEditingMode' class="btn btn-default pull-left" @click='setEditingMode(true)'>
        <span class="icon icon-cog"></span>
        <span class="icon icon-right-dir"></span>
      </button>
      <button v-if='!BUSY_BACKEND && isEditingMode' class="btn btn-default pull-left" @click='setEditingMode(false)'>
        <span class="icon icon-cog"></span>
        <span class="icon icon-left-dir"></span>
      </button>
      <span style='line-height: 24px; padding-left: 5px; font-size: 0.9em; color: grey'>{{LOG_MESSAGE.message}}</span>
      <button v-if='BUSY_FETCHINGARTICLES && ONLINE_STATUS' class="btn btn-negative pull-right" @click='abortBackend'>Abort</button>
      <button v-if='!BUSY_FETCHINGARTICLES && ONLINE_STATUS && !BUSY_COMPACTING' class="btn btn-primary pull-right" @click='forceArticleRefresh'>
        Refresh
      </button>
      <button v-if='BUSY_FETCHINGARTICLES && !BUSY_COMPACTING && ONLINE_STATUS' class="btn btn-warning pull-right" disabled>Fetching</button>
      <button v-if='BUSY_COMPACTING && !BUSY_FETCHINGARTICLES && ONLINE_STATUS' class="btn btn-warning pull-right" disabled>Compacting Database</button>
      <button v-if='!ONLINE_STATUS' class="btn btn-error pull-right" disabled>Offline</button>
    </div>
  </footer>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'appfooter',
  computed: {
    isEditingMode: {
      get () {
        return this.$store.getters.getEditingMode
      }
    },
    BUSY_BACKEND: {
      get () {
        return this.$store.getters.getBusyFetchingArticles || this.$store.getters.getBusyCompacting
      }
    },
    BUSY_FETCHINGARTICLES: {
      get () {
        return this.$store.getters.getBusyFetchingArticles
      }
    },
    BUSY_COMPACTING: {
      get () {
        return this.$store.getters.getBusyCompacting
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
    },
    setEditingMode: function (arg) {
      this.$store.dispatch('setEditingMode', arg)
    },
    abortBackend: function () {
      ipcRenderer.send('ABORT')
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
