<template>
  <div class="pane">
    <h5 class="nav-group-title">Select the blades you wish to delete:</h5>
    <div class='padded-more' style="padding-top: 0px">
      <span v-for='feed, index in feeds' :key="feed.uiorder">
        <button class="btn" :class="{'btn-default': !markedFeeds[index], 'btn-negative': markedFeeds[index]}" @click="toggleMarkedFeed(index)">
          <img class="img-circle pull-left" :src="getFeedIcon(feed._id)" width="15" :class="{inverted: lightsout}">
          &nbsp{{feed.name}}
        </button>
      </span>
      <div>
        <br>
        <ul>
          <li>Deleting an entire blade will clear your database from all previously recorded data linked to this source</li>
          <li>Only data that has been stored in an archive will not be affected</li>
          <li>Please note that this operation cannot be undone</li>
          <li>Proceed with caution</li>
        </ul>
        <button v-if="numberSelected === 1" class="btn btn-negative" @click="deleteBlades()">
          Delete {{numberSelected}} blade
        </button>
        <button v-if="numberSelected > 1" class="btn btn-negative" @click="deleteBlades()">
          Delete {{numberSelected}} blades
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'deleteblade',
  data: function () {
    return {
      markedFeeds: []
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
    },
    numberSelected: {
      get () {
        let count = 0
        for (let i = 0; i < this.markedFeeds.length; i++) {
          if (this.markedFeeds[i]) {
            count += 1
          }
        }
        return count
      }
    }
  },
  methods: {
    getFeedIcon (id) {
      return 'file://' + require('path').join(require('electron').remote.getGlobal('appFolders').cache, id, 'favicons.png')
    },
    toggleMarkedFeed (index) {
      this.markedFeeds[index] = !this.markedFeeds[index]
      this.markedFeeds.push('update')
      this.markedFeeds.pop()
    },
    deleteBlades () {
      let feedsList = []
      for (let i = 0; i < this.markedFeeds.length; i++) {
        if (this.markedFeeds[i]) {
          for (let x = 0; x < this.feeds.length; x++) {
            if ((i + 1) === this.feeds[x].uiorder) {
              feedsList.push(this.feeds[x]._id)
            }
          }
        }
      }
      this.markedFeeds = []
      this.$store.dispatch('deleteFeeds', feedsList)
    }
  }
}
</script>

<style scoped>
.inverted {
  filter: invert(100%)
}
</style>
