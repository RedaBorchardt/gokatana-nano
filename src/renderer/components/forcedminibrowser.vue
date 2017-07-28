<template>
  <div>
    <webview useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25"
    class="pane-mini sidebar" :src="url" style="display:inline-flex; width: 100%; height: 100%" css="html {filter: grayscale(100%);}"></webview>
  </div>
</template>

<script>
export default {
  name: 'forcedminibrowser',
  props: ['url']
}
</script>

<style scoped>
.hidescrollbar {
  overflow-y: hidden;
}
</style>
