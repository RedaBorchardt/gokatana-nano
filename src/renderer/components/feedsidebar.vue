<template>
  <div class="pane pane-sm sidebar">
    <nav class="nav-group">
      <h5 class="nav-group-title">Direct Feeds</h5>
      <span v-for='feed in feeds' class="nav-group-item" :class="{active: feed.selected}" @click='selectFeed(feed._id)'>
        <span class="icon icon-rss"></span>
        {{feed.name}} ({{feed.count}})
      </span>
    </nav>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'feedsidebar',
  computed: {
    feeds: {
      get () {
        return this.$store.getters.getFeeds
      }
    }
  },
  methods: {
    selectFeed (feedid) {
      this.$store.dispatch('retrieveArticles', feedid)
      this.$store.dispatch('setSelectedFeed', feedid)
    }
  },
  mounted () {
    this.$store.dispatch('retrieveFeedsFromBackend')
    let _this = this
    ipcRenderer.on('PUSH_UPDATED_FEED_TO_CLIENT', function (event, feedid) {
      _this.$store.dispatch('retrieveIndividiualArticleCount', feedid)
    })
  }
}
</script>

<style scoped>
</style>