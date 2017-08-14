<template>
  <div class="pane">
    <h5 v-if="!feeditem" class="nav-group-title">Select the blade you wish to edit:</h5>
    <div class='padded-more' style="padding-top: 0px">
      <span v-for='feed, index in feeds' :key="feed.uiorder">
        <button class="btn" :class="{'btn-default': !markedFeeds[index], 'btn-negative': markedFeeds[index]}" @click="selectMarkedFeed(index)">
          <img class="img-circle pull-left" :src="getFeedIcon(feed._id)" width="15" :class="{inverted: lightsout}">
          &nbsp{{feed.name}}
        </button>
      </span>
    </div>
    <editblade name="subedit" :feeditem="feeditem" v-if="feeditem"></editblade>
  </div>
</template>

<script>
import editblade from './editblade'

export default {
  name: 'editfeed',
  components: { editblade },
  data: function () {
    return {
      markedFeeds: [],
      feeditem: '',
      showsub: false
    }
  },
  computed: {
    feeds: {
      get () {
        return this.$store.getters.getFeeds
      }
    },
    lightsout: {
      get () {
        return this.$store.getters.getLightsOutState
      }
    }
  },
  methods: {
    getFeedIcon (id) {
      return 'file://' + require('path').join(require('electron').remote.getGlobal('appFolders').cache, id, 'favicons.png')
    },
    selectMarkedFeed (index) {
      this.markedFeeds = []
      this.markedFeeds[index] = !this.markedFeeds[index]
      this.markedFeeds.push('update')
      this.markedFeeds.pop()
      this.feeditem = this.$store.getters.getFeeds[index]
    }
  }
}
</script>

<style scoped>
.inverted {
  filter: invert(100%)
}
</style>
