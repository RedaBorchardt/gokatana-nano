<template>
    <div class="pane-group">
      <optionsmenu></optionsmenu>
      <editfeed v-if="optionsMenuSelected == 0"></editfeed>
      <deleteblade v-if="optionsMenuSelected == 2"></deleteblade>
    </div>
</template>

<script>
import editfeed from './editfeed'
import deleteblade from './deleteblade'
import optionsmenu from './optionsmenu'

export default {
  components: {editfeed, optionsmenu, deleteblade},
  name: 'otions',
  computed: {
    optionsMenuSelected: {
      get () {
        return this.$store.getters.getOptionsMenuSelected
      }
    }
  }
}
</script>

<style>
</style>
