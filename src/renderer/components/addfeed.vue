<template>
  <div class="pane" style="min-width: 450px">
    <div class='padded-more'>
      <table style='max-width: 450px'>
        <tr>
          <td width='150px' align='right' valign='center'>
            Blade Name*:
          </td>
          <td align='left'>
            <input type="text" class="form-control" name="blade_name" v-model="bladename" :class="{'error': checkName()}">
          </td>
        </tr>
        <tr>
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
            <input type="text" class="form-control" name="sourcename" v-model="sourcename" :class="{'error': checkSourceName()}">
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
              <button style='width: 70px' v-if="!verified()" class="btn btn-form btn-primary pull-left" @click='verify'>Verify</button>
              <button style='width: 70px' v-if="verified()" class="btn btn-form btn-positive pull-left" @click='addFeed()'>Add</button>
            </div>
          </td>
        </tr>
          <tr><td width='150px'></td><td><div style='max-width: 300px' v-if="verifymessage && sourcetype == 'standard'">{{verifymessage}}</div></td></tr>
        <tr v-if="sourcetype == 'google'">
          <td width='150px' align='right' valign='center'>
            Google Search Term:
          </td>
          <td align='left'>
            <input type="text" class="form-control" name="googlesearch">
          </td>
          <td>
            <div class="form-actions">
              <button class="btn btn-form btn-primary pull-left">Verify</button>
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
              <button class="btn btn-form btn-primary pull-left">Verify</button>
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
              <button class="btn btn-form btn-primary pull-left">Verify</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
let FeedParser = require('feedparser')
let request = require('request')
let validUrl = require('valid-url')

export default {
  name: 'addfeed',
  data: function () {
    return {
      'bladename': '',
      'website': '',
      'retention': '2',
      'maxitems': '400',
      'sourcename': '',
      'sourcetype': 'standard',
      'sourcelink': '',
      'verifymessage': '',
      'verifiedlink': '',
      'sources': [],
      'verified': function () {
        return ((this.verifiedlink === this.sourcelink) && (this.sourcelink !== ''))
      },
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
    },
    checkSourceName: function (event) {
      let conflict = false
      for (let i = 0; i < this.sources.length; i++) {
        if (this.sourcename.toLowerCase().trim() === this.sources[i].name.toLowerCase().trim()) conflict = this.sources[i].name
      }
      return conflict
    },
    addFeed: function (type) {
      let sourceitem = {
        'name': this.sourcename,
        'link': this.verifiedlink,
        'type': this.sourcetype
      }

      if (!this.checkSourceName()) {
        this.sources.push(sourceitem)
        this.verifiedlink = ''
        this.sourcelink = ''
        this.sourcename = ''
        this.verifymessage = ''
      }
      console.log(this.sources)
    },
    verify: function (event) {
      let originallink = this.sourcelink
      /* eslint-disable */
      if (validUrl.isUri(this.sourcelink)){
        //
      } else {
        this.verifymessage = 'Invalid. Missing http:// maybe?'
        return false
      }

      let _this = this
      let reqobj = {uri: _this.sourcelink, timeout: 5000}
      var req = request(reqobj)
      var feedparser = new FeedParser()
      let count = 0

      req.on('error', function (error) {
        _this.verifymessage = error.code
      })

      req.on('response', function (res) {
        var stream = this // `this` is `req`, which is a stream

        if (res.statusCode !== 200) {
          this.emit('error', new Error('Bad status code'))
        }
        else {
          stream.pipe(feedparser)
        }
      })

      feedparser.on('error', function (error) {
        _this.verifymessage = error.code
      })

      feedparser.on('readable', function () {
        // This is where the action is!
        var stream = this // `this` is `feedparser`, which is a stream
        var meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        var item

        while (item = stream.read()) {
          count += 1
        }
      })

      feedparser.on('end', function(error) {
        if (!error) {
          if (count) {
            _this.verifymessage = count + ' feed items found'
            _this.verifiedlink = originallink
          } else {
            _this.verifymessage = 'Not a feed'
          }
        } else {
          _this.verifymessage = error.code
        }
      })
      /* eslint-enable */
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

tr:active {
  background-color: initial;
  color: initial;
}
</style>
