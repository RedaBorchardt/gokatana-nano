<template>
  <div class="pane pane-sm sidebar scroll" style="flex: inherit; max-width: none; min-width: 240px; overflow-x: hidden;">
    <nav class="nav-group">
      <dragfeed v-model='feeds' :options="{sort: !BUSY_BACKEND, disabled: BUSY_BACKEND, handle: '.dragitem'}">
        <transition-group>
          <span v-for='feed, index in feeds' class="nav-group-item" :class="{active: feed.selected}" :key="feed.uiorder" style="align">
            <span v-if='!BUSY_BACKEND' class="icon icon-menu pull-left dragitem" style='color: #cccccc;'></span>
            <span v-if='BUSY_BACKEND' class="icon icon-air pull-left" style='color: #dddddd;'></span>
            <div @click='selectFeed(feed._id, index)'>
            <img class="img-circle media-object pull-left" :src="getFeedIcon(feed._id)" width="18" :class="{inverted: lightsout}">
            {{feed.name}}
              <span class="counter pull-right">
                {{feed.count}}
              </span>
            </div>
              <template v-if="hasFeedChildren(index) && feed.selected">
                <span v-for='subfeed, index in feeds[index].rss' class="nav-group-item subfeed" :class="{subactive: checkTopicMatch(feed.rss[index].name)}" @click='selectFeed(feed._id, index, feed.rss[index].name)'>
                  {{subfeed.name}}
                  <span v-if='feed.subfeedcount' class="smallcounter counter pull-right subfeedcounter" v-text="feed.subfeedcount[subfeed.name]">
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
    },
    lightsout: {
      get () {
        return this.$store.getters.getLightsOutState
      }
    }
  },
  methods: {
    selectFeed (feedid, index, topicfilter) {
      if (topicfilter) {
        let arg = {feedid: feedid, topicfilter: topicfilter}
        this.$store.dispatch('retrieveSubfeedArticle', arg)
      } else {
        this.$store.dispatch('retrieveArticles', feedid)
      }
      this.$store.dispatch('setSelectedFeed', feedid)
      this.$store.dispatch('setSelectedSubFeed', topicfilter)
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
    },
    checkTopicMatch (topicfilter) {
      if (this.$store.getters.getTopicFilter) {
        if (topicfilter === this.$store.getters.getTopicFilter) {
          return true
        } else {
          return false
        }
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
.subactive {
  background-color: #eeeeee;
  border-radius: 5px;
}

.nav-group-item .subfeed {
  padding-left: 58px;
  font-size: 0.9em;
  margin-bottom: 0px;
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
  background-color: #d77;
  color: white 1.6em;
  margin-right: -7px;
  text-align: center;
  padding: .2em .0em .3em;
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

.inverted {
  filter: invert(100%)
}
</style>
