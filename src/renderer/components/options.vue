<template>
    <div class="pane-group">
      <optionsmenu></optionsmenu>
      <addfeed v-if="optionsMenuSelected == 0"></addfeed>
      <editfeed v-if="optionsMenuSelected == 1"></editfeed>
      <deleteblade v-if="optionsMenuSelected == 2"></deleteblade>
    </div>
</template>

<script>
import addfeed from './addfeed'
import deleteblade from './deleteblade'
import optionsmenu from './optionsmenu'
import editfeed from './editfeed'

export default {
  components: {addfeed, optionsmenu, deleteblade, editfeed},
  name: 'options',
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
