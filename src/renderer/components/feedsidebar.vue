<template>
  <div class="pane pane-sm sidebar scroll">
    <nav class="nav-group">
      <h5 class="nav-group-title">Direct Feeds</h5>
      <dragfeed v-model='feeds' :options="{sort: !BUSY_BACKEND, disabled: BUSY_BACKEND}">
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
    BUSY_BACKEND: {
      get () {
        return this.$store.getters.getBusyFetchingArticles || this.$store.getters.getBusyCompacting
      }
    },
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
      return 'file://' + require('path').join(require('electron').remote.getGlobal('appFolders').cache, id, 'favicons.png')
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
.scroll::-webkit-scrollbar {
  width: 5px;
}

.scroll::-webkit-scrollbar-track {
  background: #ddd;
}

.scroll::-webkit-scrollbar-thumb {
  background: #d66;
}
</style>
