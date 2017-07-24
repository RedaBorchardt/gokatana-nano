<template>
  <div class="pane pane-sm sidebar">
    <nav class="nav-group">
      <h5 class="nav-group-title">Direct Feeds</h5>
      <dragfeed v-model='feeds' :options="{sort: true}">
        <transition-group>
          <span v-for='feed in feeds' class="nav-group-item" :class="{active: feed.selected}" @click='selectFeed(feed._id)' :key="feed.uiorder">
            <img class="img-circle media-object pull-left" :src="getFeedIcon(feed._id)" width="18">
            {{feed.name}} ({{feed.count}})
          </span>
        </transition-group>
      </dragfeed>
    </nav>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import dragfeed from 'vuedraggable'

export default {
  name: 'feedsidebar',
  components: { dragfeed },
  computed: {
    feeds: {
      get () {
        return this.$store.getters.getFeeds
      },
      set (obj) {
        this.$store.dispatch('updateFeedsListOnDrop', obj)
      }
    }
  },
  methods: {
    selectFeed (feedid) {
      this.$store.dispatch('retrieveArticles', feedid)
      this.$store.dispatch('setSelectedFeed', feedid)
    },
    getFeedIcon (id) {
      return require('path').join(require('electron').remote.getGlobal('appFolders').cache, id, 'favicons.png')
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
