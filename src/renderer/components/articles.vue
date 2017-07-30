<template>
  <div class="pane scroll" style='max-width:500px;'>
    <ul class="list-group">
      <li class="list-group-header">
        <input style='width: 50%' class="form-control" type="text" placeholder="Keyword Search" v-model="searchstring">
        <input style='width: 50%' class="form-control" type="text" placeholder="Exclude Keyword" v-model="excludestring">
      </li>
      <li v-for='article in articles' class="list-group-item" :class="{active: article.selected}" v-if="( searchMatch(article.title) || searchMatch(article.summary) )
      && !( excludeMatch(article.title) || excludeMatch(article.summary) ) "
      @click='displayArticle(article.link, article._id, article.summary)'>
          <img class="img-circle media-object pull-left" :class="{seen: article.read}" :src="getFeedIcon(article._feedid)" width="18" height="18">
          <div class="media-body" style='min-height: 35px;' :class="{read: article.read}">
            <strong v-html="article.title"></strong>
            <p v-if='article.summary  && !article.read' v-html="parsedOutput(article.summary.trunc(280, true))" style="-webkit-user-select: text;-webkit-user-select:none;"></p>
            <p v-if='article.summary  && article.read' v-html="parsedOutput(article.summary.trunc(70, true))" style="-webkit-user-select: text;-webkit-user-select:none;"></p>
          </div>
          <p v-if='!article.read' style='font-style: italic; font-size: 0.8em; text-align: right; -bottom: 0px; padding-left: 26px;'><span class='pull-left'>Source: {{parseURL(article.link)}}</span>{{dateFromNow(article.date)}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
let moment = require('moment')
let url = require('url')

export default {

  name: 'articles',
  components: { },
  data: function () {
    return {
      searchfield: '',
      excludefield: '',
      searchstring: '',
      excludestring: ''
    }
  },
  computed: {
    articles: {
      get () {
        return this.$store.getters.getArticlesInView
      }
    }
  },
  methods: {
    dateFromNow (date) {
      let dt = moment(date)
      return dt.fromNow()
    },
    submitSearchString () {
      this.searchstring = this.searchfield
      this.excludestring = this.excludefield
    },
    searchMatch (target) {
      if (this.searchstring.trim() === '') {
        return true
      }
      if (target.toLowerCase().includes(this.searchstring.toLowerCase())) {
        return true
      } else {
        return false
      }
    },
    excludeMatch (target) {
      if (this.excludestring.trim() === '') {
        return false
      }
      if (target.toLowerCase().includes(this.excludestring.toLowerCase())) {
        return true
      } else {
        return false
      }
    },
    parsedOutput (s) {
      return s.replace(/\\"/, '"')
    },
    displayArticle (url, articleid, articleSummary) {
      ipcRenderer.send('DISPLAY_ARTICLE', url, articleSummary)
      ipcRenderer.send('MARK_AS_READ', this.$store.getters.getArticlesInView[0]._feedid, articleid)
      this.$store.dispatch('markArticleAsRead', articleid)
      this.selectArticle(articleid)
    },
    parseURL (link) {
      return url.parse(link).hostname
    },
    selectArticle (articleid) {
      this.$store.dispatch('setSelectedArticle', articleid)
    },
    getFeedIcon (id) {
      return 'file://' + require('path').join(require('electron').remote.getGlobal('appFolders').cache, id, 'favicons.png')
    }
  },
  mounted () {
    let _this = this

    this.$store.dispatch('listenForContentFromBackend')

    ipcRenderer.on('NEW_FEED_SELECTED', function (event, arg) {
      _this.$el.scrollTop = 0
    })

    ipcRenderer.on('PUSH_UPDATED_FEED_TO_CLIENT', function (event, feedid) {
      if (_this.$store.getters.getArticlesInView[0]) {
        if (_this.$store.getters.getArticlesInView[0]._feedid === feedid) {
          _this.$store.dispatch('retrieveArticles', feedid)
        }
      } else {
        _this.$store.dispatch('retrieveArticles', _this.$store.getters.getFeeds[0]._id)
        _this.$store.dispatch('setSelectedFeed', _this.$store.getters.getFeeds[0]._id)
      }
    })
  }
}
</script>

<style scoped>

.read {
  font-style: italic;
  color: #bbbbbb;
}

.seen {
  opacity: 0.5;
}

p {
  white-space: normal
}

strong {
  white-space: normal
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

</style>
