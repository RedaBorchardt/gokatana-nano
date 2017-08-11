<template>
    <div class="pane-group">
      <optionsmenu></optionsmenu>
      <addfeed v-if="optionsMenuSelected == 0"></addfeed>
      <deleteblade v-if="optionsMenuSelected == 2"></deleteblade>
    </div>
</template>

<script>
import addfeed from './addfeed'
import deleteblade from './deleteblade'
import optionsmenu from './optionsmenu'

export default {
  components: {addfeed, optionsmenu, deleteblade},
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
