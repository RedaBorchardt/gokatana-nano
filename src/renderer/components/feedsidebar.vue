<template>
  <div class="pane pane-sm sidebar scroll" style="flex: inherit; max-width: none; min-width: 240px; overflow-x: hidden;">
    <nav class="nav-group">
      <h5 class="nav-group-title">Direct Feeds</h5>
      <dragfeed v-model='feeds' :options="{sort: !BUSY_BACKEND, disabled: BUSY_BACKEND, handle: '.dragitem'}">
        <transition-group>
          <span v-for='feed, index in feeds' class="nav-group-item" :class="{active: feed.selected}" @click='selectFeed(feed._id, index)' :key="feed.uiorder" style="align">
            <span v-if='!BUSY_BACKEND' class="icon icon-menu pull-left dragitem" style='color: #cccccc;'></span>
            <span v-if='BUSY_BACKEND' class="icon icon-air pull-left" style='color: #dddddd;'></span>
            <img class="img-circle media-object pull-left" :src="getFeedIcon(feed._id)" width="18">
            {{feed.name}}
              <span class="counter pull-right">
                {{feed.count}}
              </span>
              <template v-if="hasFeedChildren(index) && feed.selected">
                <span v-for='subfeed, index in feeds[index].rss' class="nav-group-item subfeed">
                  {{subfeed.name}}
                  <span class="smallcounter pull-right subfeedcounter" v-text="feed.subfeedcount[subfeed.name]">
                  </span>
                </span>
              </template>
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
    selectFeed (feedid, index) {
      this.$store.dispatch('retrieveArticles', feedid)
      this.$store.dispatch('setSelectedFeed', feedid)
      this.$store.dispatch('countFeedChildItems', index)
    },
    getFeedIcon (id) {
      return 'file://' + require('path').join(require('electron').remote.getGlobal('appFolders').cache, id, 'favicons.png')
    },
    hasFeedChildren (index) {
      if (this.$store.getters.getFeeds[index].rss.length > 1) {
        return true
      } else {
        return false
      }
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
.nav-group-item .subfeed {
  padding-left: 58px;
  font-size: 0.9em;
}

.counter {
  width: 30px;
  background-color: #777;
  color: white;
  font-size: 75%;
  border-radius: 4px;
  vertical-align: baseline;
  text-align: center;
  display: inline;
  padding: .2em .6em .3em;
  line-height: 1.6em;
}

.smallcounter {
  width: 25px;
  background-color: #c99;
  color: white;
  font-size: 75%;
  border-radius: 4px;
  vertical-align: baseline;
  text-align: center;
  display: inline;
  padding: .2em .6em .3em;
  line-height: 1.6em;
  margin-right: -7px;
}

.scroll::-webkit-scrollbar {
  width: 5px;
}

.scroll::-webkit-scrollbar-track {
  background: #ddd;
}

.scroll::-webkit-scrollbar-thumb {
  background: #d66;
}

.nav-group-item {
  font-size: 1em;
  padding-left: 10px;
}
</style>
