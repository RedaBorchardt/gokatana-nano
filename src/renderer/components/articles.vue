<template>
  <div class="pane">
    <ul class="list-group">
      <li class="list-group-header">
        <input class="form-control" type="text" placeholder="Keyword Filter">
      </li>
      <li v-for='article in articles' class="list-group-item">
          <img class="img-circle media-object pull-left" src='~@/assets/KLOGO.png' width="32" height="32">
          <div class="media-body">
            <strong v-html="article.title"></strong>
            <p v-if='article.summary' v-html="article.summary.trunc(280, true)"></p>
            <p>{{article.date}}</p>
          </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'articles',
  components: { },
  computed: {
    articles: {
      get () {
        return this.$store.getters.getArticlesInView
      }
    }
  },
  methods: {

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
