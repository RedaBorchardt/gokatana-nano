<template>
  <div id='wrapper'>
    <div style='color: grey; padding: 10px; font-size: 10px; line-height: 12px' v-html='messagelog'></div>
    <div id="center">
        <Spinner
          :speed='0.5'
          :size="150"
          :line-size="12">
        </Spinner>
        <p>{{message}}</p>
    </div>
</div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
const {ipcRenderer} = require('electron')

export default {
  name: 'loader',
  components: { Spinner },
  data: function () {
    return {
      message: 'Starting Up',
      messagelog: 'Starting Up'
    }
  },
  computed: {
    initMessage: function () {
      return this.message
    }
  },
  mounted () {
    ipcRenderer.send('startup_application')
    ipcRenderer.on('startup_application_message', (event, arg) => {
      this.message = arg
      this.messagelog += '<br>' + arg
      if (arg === 'All checks have been performed. Entering GoKatana...') {
        this.$router.push('/mainwindow')
      }
    })
  }
}
</script>

<style scoped>
#wrapper {
  height: 100vh;
  width: 100%;
}

#center {
  position: absolute;
  width: 200px;
  height: 200px;
  z-index: 15;
  top: 50%;
  left: 50%;
  margin: -100px 0 0 -100px;
  text-align: center;
}
</style>
