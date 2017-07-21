<template>
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

      <div class="btn-group pull-right" @click='toggleMobileView'>
        <button class="btn btn-default" :class="{active: mobileViewState}">
          <span class="icon icon-network"></span>
        </button>
      </div>

    </div>
  </header>
</template>

<script>
export default {
  name: 'topbar',
  computed: {
    mobileViewState: {
      get () {
        return this.$store.getters.getMobileViewState
      }
    }
  },
  methods: {
    toggleMobileView () {
      this.$store.dispatch('toggleMobileView')
    }
  }
}
</script>

<style scoped>
</style>
