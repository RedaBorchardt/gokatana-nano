<template>
  <div class="pane pane-sm sidebar">
    <nav class="nav-group">
      <h5 class="nav-group-title">Subscriptions</h5>
      <span v-for='feed in feeds' class="nav-group-item" :class="{active: feed.active}">
        <span class="icon icon-rss"></span>
        {{feed.name}}
      </span>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'feedsidebar',
  computed: {
    feeds: {
      get () {
        return this.$store.getters.getFeeds
      }
    }
  },
  mounted () {
    this.$store.dispatch('retrieveFeedsFromBackend')
  }
}
</script>

<style scoped>
</style>
