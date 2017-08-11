<template>
  <div class="pane" style="min-width: 450px">
    <div class='padded-more'>
          <table style='max-width: 450px'>
            <tr>
              <td width='150px' align='right' valign='center'>
                Blade Name*:
              </td>
              <td align='left'>
                <input type="text" class="form-control" name="blade_name" placeholder="" v-model="bladename" :class='{"error": checkName()}'>
              </td>
            <tr>
            </tr>
              <td width='150px' align='right' valign='center'>
                Website (used for icon)*:
              </td>
              <td align='left'>
                <input type="text" class="form-control" name="website" v-model="website">
              </td>
              <td valign='middle'>
                <img class="img-circle media-object pull-right" :src="icon()" width="18" :class="{inverted: lightsout()}">
              </td>
            </tr>
            <tr>
              <td width='150px' align='right' valign='center'>
                Retention (in days)*:
              </td>
              <td align='left'>
                <input type="text" class="form-control" style="width: 45px" name="retention" maxlength='3' v-model="retention">
              </td>
            </tr>
            <tr>
              <td width='150px' align='right' valign='center'>
                Maximum Items*:
              </td>
              <td align='left'>
                <input type="text" class="form-control" style="width: 45px" name="maxitems" maxlength='3' v-model="maxitems">
              </td>
            </tr>
          </table>
      <h5>Add Feed</h5>
          <table style='max-width: 480px'>
            <tr>
              <td width='150px' align='right' valign='center'>
                Source Name*:
              </td>
              <td align='left'>
                <input type="text" class="form-control" name="sourcename">
              </td>
            </tr>
            <tr>
              <td width='150px' align='right' valign='center'>
                Source Type*:
              </td>
              <td align='left'>
                <select name="sourcetype" class="form-control" v-model="sourcetype">
                  <option value="standard">Standard RSS/Atom</option>
                  <option value="google">Google News</option>
                  <option value="bing">Bing News</option>
                  <option value="youtube">Youtube</option>
                </select>
              </td>
            </tr>
            <tr v-if="sourcetype == 'standard'">
              <td width='150px' align='right' valign='center'>
                RSS/Atom Link*:
              </td>
              <td align='left'>
                <input type="text" class="form-control" name="sourcelink" v-model="sourcelink">
              </td>
              <td>
                <div class="form-actions">
                  <button class="btn btn-form btn-primary pull-left">Verify</button>
                </div>
              </td>
            </tr>
            <tr v-if="sourcetype == 'google'">
              <td width='150px' align='right' valign='center'>
                Google Search Term:
              </td>
              <td align='left'>
                <input type="text" class="form-control" name="googlesearch">
              </td>
              <td>
                <div class="form-actions">
                  <button class="btn btn-form btn-primary pull-right">Verify</button>
                </div>
              </td>
            </tr>
            <tr v-if="sourcetype == 'bing'">
              <td width='150px' align='right' valign='center'>
                Bing Search Term:
              </td>
              <td align='left'>
                <input type="text" class="form-control" name="bingsearch">
              </td>
              <td>
                <div class="form-actions">
                  <button class="btn btn-form btn-primary pull-right">Verify</button>
                </div>
              </td>
            </tr>
            <tr v-if="sourcetype == 'youtube'">
              <td width='150px' align='right' valign='center'>
                Youtube Channel Name:
              </td>
              <td align='left'>
                <input type="text" class="form-control" name="youtubechannel">
              </td>
              <td>
                <div class="form-actions">
                  <button class="btn btn-form btn-primary pull-right">Verify</button>
                </div>
              </td>
            </tr>
          </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addfeed',
  data: function () {
    return {
      'bladename': '',
      'website': '',
      'retention': '2',
      'maxitems': '400',
      'sourcetype': 'standard',
      'sourcelink': '',
      'icon': function () {
        if (!this.website) {
          return 'http://www.google.com/s2/favicons?domain=www.gokatana.com'
        }
        return 'http://www.google.com/s2/favicons?domain=' + this.website
      },
      'lightsout': function () {
        return this.$store.getters.getLightsOutState
      }
    }
  },
  methods: {
    checkName: function (event) {
      let conflict = false
      let arraytocheck = this.$store.getters.getFeeds
      for (let i = 0; i < arraytocheck.length; i++) {
        if (this.bladename.toLowerCase().trim() === arraytocheck[i].name.toLowerCase().trim()) conflict = arraytocheck[i].name
      }
      return conflict
    }
  }
}
</script>

<style scoped>

.error {
  background-color: #FF0000;
}

td {
  padding: 2px 3px 3px 2px
}

label {
  margin-bottom: 0px
}

textarea {
  resize: none;
}

.inverted {
  filter: invert(100%)
}

h5 {
  margin-top: 0px
}
</style>
