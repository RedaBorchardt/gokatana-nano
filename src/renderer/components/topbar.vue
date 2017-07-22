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

      <div class="btn-group pull-right">
        <button class="btn" :class="{'btn-positive': mobileLinkState && mobileViewState, 'btn-default': !mobileLinkState && mobileViewState}" @click='toggleMobileLinkState'>
          <span class="icon icon-link" :class="{whiteicon: mobileLinkState && mobileViewState, 'btn-default': !mobileLinkState && mobileViewState}"></span>
        </button>
        <button class="btn" :class="{'btn-positive': mobileViewState, 'btn-default': !mobileViewState}" @click='toggleMobileView'>
          <span class="icon icon-network" :class='{whiteicon: mobileViewState}'></span>
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
    },
    mobileLinkState: {
      get () {
        return this.$store.getters.getMobileViewLinkState
      }
    }
  },
  methods: {
    toggleMobileView () {
      this.$store.dispatch('toggleMobileView')
    },
    toggleMobileLinkState () {
      this.$store.dispatch('toggleMobileLinkState')
    }
  }
}
</script>

<style scoped>
.whiteicon {
  color: white;
}
</style>
