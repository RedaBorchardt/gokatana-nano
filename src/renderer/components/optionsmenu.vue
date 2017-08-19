<template>
  <div class="pane-sm sidebar">
    <nav class="nav-group">
      <h5 class="nav-group-title">Options</h5>
      <span class="nav-group-item" :class="{active: optionsMenuSelected == 0}" @click="setOptionsMenuSelected(0)">
        <span class="icon icon-plus"></span>
        Create New Blade
      </span>
      <span class="nav-group-item" :class="{active: optionsMenuSelected == 1}" @click="setOptionsMenuSelected(1)">
        <span class="icon icon-pencil"></span>
        Modify Blade
      </span>
      <span class="nav-group-item" :class="{active: optionsMenuSelected == 2}" @click="setOptionsMenuSelected(2)">
        <span class="icon icon-minus"></span>
        Delete Blade
      </span>
      <span class="nav-group-item" @click="gotoWebsite()">
        <span class="icon icon-book"></span>
        Support
      </span>
    </nav>
  </div>
</template>

<script>
import { shell } from 'electron'

export default {
  name: 'optionsmenu',
  computed: {
    optionsMenuSelected: {
      get () {
        return this.$store.getters.getOptionsMenuSelected
      }
    }
  },
  methods: {
    setOptionsMenuSelected (arg) {
      this.$store.dispatch('setOptionsMenuSelected', arg)
    },
    gotoWebsite () {
      shell.openExternal('http://www.gokatana.com')
    }
  }
}
</script>

<style scoped>
</style>
