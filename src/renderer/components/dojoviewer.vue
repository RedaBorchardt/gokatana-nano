<template>
  <div class='pane' style='max-width:600px;'>
    <div class='padded-more'>
      <h4 style='white-space: pre-line;'>{{content.dojoTitle}}</h4>
      <div v-html="content.dojoHTML"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dojoviewer',
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
