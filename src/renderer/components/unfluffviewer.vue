<template>
  <div class='pane' style='max-width:600px;'>
    <div class='padded-more'>
      <img style='width: 100%' :src="content.image">
      <h4 style='white-space: pre-line;'>{{content.title}}</h4>
    <p style='white-space: pre-line; font-size: 1.2em;' v-html="content.text">
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'unfluffviewer',
  computed: {
    content: {
      get () {
        return this.$store.getters.getContentInView
      }
    }
  }
}
</script>

<style scoped>
</style>
