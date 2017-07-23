<template>
  <div class="pane" style='max-width:500px;'>
    <ul class="list-group">
      <li class="list-group-header">
        <input style='width: 50%' class="form-control" type="text" placeholder="Keyword Search" v-model="searchstring">
        <input style='width: 50%' class="form-control" type="text" placeholder="Exclude Keyword" v-model="excludestring">
      </li>
      <li v-for='article in articles' class="list-group-item" v-if="( searchMatch(article.title) || searchMatch(article.summary) )
      && !( excludeMatch(article.title) || excludeMatch(article.summary) ) "
      @click='displayArticle(article.link)'>
          <img class="img-circle media-object pull-left" src='~@/assets/KLOGO.png' width="32" height="32">
          <div class="media-body" style='min-height: 35px'>
            <strong v-html="article.title"></strong>
            <p v-if='article.summary' v-html="parsedOutput(article.summary.trunc(280, true))"></p>
          </div>
          <p style='font-style: italic; font-size: 0.8em; color: grey; text-align: right; -bottom: 0px; padding-left: 42px;'><span class='pull-left'>Source: {{parseURL(article.link)}}</span>{{dateFromNow(article.date)}}</p>
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
    displayArticle (url) {
      ipcRenderer.send('DISPLAY_ARTICLE', url)
    },
    parseURL (link) {
      return url.parse(link).hostname
    }
  },
  mounted () {
    this.$store.dispatch('listenForContentFromBackend')
  }
}
</script>

<style scoped>

p {
  white-space: normal
}

strong {
  white-space: normal
}

</style>
