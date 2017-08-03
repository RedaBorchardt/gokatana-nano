<template>
  <div class="pane" style="min-width: 400px">
    <div class='padded-more'>
      <form>
        <label>Feed Type: Standard</label>
        <div class="form-group">
          <label>Feed Name</label>
          <input type="email" class="form-control" placeholder="">
        </div>
        <div class="form-group">
          <label>Website</label>
          <input type="password" class="form-control" placeholder="http://example.com">
        </div>
        <div class="form-group">
          <label>Retention</label>
          <input class="form-control" placeholder="2 days (Default)">
        </div>
        <div class="form-group">
          <label>Maxiumum Items</label>
          <input class="form-control" placeholder="400 (Default)">
        </div>
        <div class="form-group">
          <label>Feeds</label>
          <textarea class="form-control" rows="3"></textarea>
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox"> Forced Mini Browser
          </label>
        </div>
        <div class="form-group">
          <label>Advanced Remove Elements List</label>
          <textarea class="form-control" rows="3"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-form btn-negative">Delete</button>
          <button type="submit" class="btn btn-form btn-warning">Cancel</button>
          <button type="submit" class="btn btn-form btn-primary">Apply Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'editfeed'
}
</script>

<style scoped>
label {
  margin-bottom: 0px
}

textarea {
  resize: none;
}
</style>
