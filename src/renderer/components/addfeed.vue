<template>
  <div class="pane" style="min-width: 450px">
    <h6 class="nav-group-title">A blade can contain more than one source. You can even mix and match sources to create your very own personalised view<br>
    If you only have a single source, it will become the primary source under the Blade title in the navigation.</h6>
    <div class='padded-more'>
      <button style='width: 130px; margin-left: 150px' v-if="!checkName() && bladename && sources[0] && retention && maxitems && website" class="btn btn-form btn-positive" @click='addBlade'>Save This Blade</button>
      <h5>General</h5>
      <table style='max-width: 450px'>
        <tr>
          <td width='150px' align='right' valign='middle'>
            Blade Name*:
          </td>
          <td align='left'>
            <input type="text" class="form-control" name="blade_name" v-model="bladename" :class="{'error': checkName()}">
          </td>
        </tr>
        <tr>
          <td width='150px' align='right' valign='middle'>
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
          <td width='150px' align='right' valign='middle'>
            Retention (in days)*:
          </td>
          <td align='left'>
            <input type="text" class="form-control" style="width: 45px" name="retention" maxlength='3' v-model="retention">
          </td>
        </tr>
        <tr>
          <td width='150px' align='right' valign='middle'>
            Maximum Items*:
          </td>
          <td align='left'>
            <input type="text" class="form-control" style="width: 45px" name="maxitems" maxlength='3' v-model="maxitems">
          </td>
        </tr>
      </table>

      <h5>Add Source</h5>
      <table style='max-width: 400px'>
        <tr>
          <td width='150px' align='right' valign='middle'>
            Source Name*:
          </td>
          <td align='left'>
            <input type="text" class="form-control" name="sourcename" v-model="sourcename" :class="{'error': checkSourceName()}">
          </td>
        </tr>
        <tr>
          <td width='150px' align='right' valign='middle'>
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
          <td width='150px' align='right' valign='middle'>
            RSS/Atom Link*:
          </td>
          <td align='left'>
            <input type="text" class="form-control" name="sourcelink" v-model="sourcelink">
          </td>
          <td valign='middle'>
            <div class="form-actions">
              <button style='width: 70px' v-if="!verified()" class="btn btn-form btn-primary pull-left" @click='verify'>Verify</button>
              <button style='width: 70px' v-if="verified() && !checkSourceName() && sourcename" class="btn btn-form btn-positive pull-left" @click='addFeed()'>Add</button>
            </div>
          </td>
        </tr>
          <tr><td width='150px'></td><td><div style='max-width: 300px' v-if="verifymessage && sourcetype == 'standard'">{{verifymessage}}</div></td></tr>
        <tr v-if="sourcetype == 'google'">
          <td width='150px' align='right' valign='middle'>
            Google Search Term:
          </td>
          <td align='left'>
            <input type="text" class="form-control" name="googlesearch" v-model="googlesearch">
          </td>
          <td valign='middle'>
            <div class="form-actions">
              <button v-if="!checkSourceName() && sourcename && googlesearch" class="btn btn-form btn-primary pull-left" @click="addGoogle">Add</button>
            </div>
          </td>
        </tr>
        <tr v-if="sourcetype == 'bing'">
          <td width='150px' align='right' valign='middle'>
            Bing Search Term:
          </td>
          <td align='left'>
            <input type="text" class="form-control" name="bingsearch" v-model="bingsearch">
          </td>
          <td valign='middle'>
            <div class="form-actions">
              <button v-if="!checkSourceName() && sourcename && bingsearch" class="btn btn-form btn-primary pull-left" @click="addBing">Add</button>
            </div>
          </td>
        </tr>
        <tr v-if="sourcetype == 'youtube'">
          <td width='150px' align='right' valign='middle'>
            Youtube Channel Name:
          </td>
          <td align='left'>
            <input type="text" class="form-control" name="youtubechannel" v-model="youtubechannel">
          </td>
          <td valign='middle'>
            <div class="form-actions">
              <button v-if="!checkSourceName() && sourcename && youtubechannel" class="btn btn-form btn-primary pull-left" @click="addYoutube">Add</button>
            </div>
          </td>
        </tr>
      </table>
      <h5>Sources</h5>
      <h6 v-if="!sources[0]">You need to add at least one source</h6>
      <table style='max-width: 450px'>
        <tr v-for="source, index in sources">
          <td>
            <span class="icon icon-minus-circled" @click="deleteSource(index)"></span>
          </td>
          <td>
            <span class="icon icon-down" @click="downSource(index)"></span>
          </td>
          <td>
            <span class="icon icon-up" @click="upSource(index)"></span>
          </td>
          <td width='150px' align='left'>
            {{source.name}}
          </td>
          <td style='max-width: 100%'>
            {{source.url}}
          </td>
        </td>
        </tr>
      </table>
      <br>
      <h5>Advanced (Optional)</h5>
      <table style='max-width: 450px'>
      <tr>
        <td style='width: 150px' align='right'>
          Forced Mini Browser:
        </td>
        <td>
          <input type='checkbox' v-model='minibrowser'>
        </td>
      </tr>
      <tr>
        <td style='width: 150px' align='right'>
          User Agent String:
        </td>
        <td>
          <input type='text' class="form-control" v-model='useragent'>
        </td>
      </tr>
      <tr>
        <td style='width: 150px' align='right'>
          Mini User Agent:
        </td>
        <td>
          <input type='text' class="form-control" v-model='miniuseragent'>
        </td>
      </tr>
      <tr>
        <td style='width: 150px'  align='right' valign="top">
          Selectors To Remove:
        </td>
        <td>
          <textarea rows="5" v-model='removeel' class="form-control" resize='none'></textarea>
        </td>
      </tr>
      </table>
      <button style='width: 130px; margin-left: 150px' v-if="!checkName() && bladename && sources[0] && retention && maxitems && website" class="btn btn-form btn-positive" @click='addBlade'>Save This Blade</button>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
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
      'googlesearch': '',
      'bingsearch': '',
      'youtubechannel': '',
      'sourcename': '',
      'sourcetype': 'standard',
      'sourcelink': '',
      'verifymessage': '',
      'verifiedlink': '',
      'minibrowser': '',
      'useragent': '',
      'miniuseragent': '',
      'removeel': '',
      'removeelarray': function () {
        return this.removeel.split('\n')
      },
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
    deleteSource: function (index) {
      this.sources.splice(index, 1)
    },
    upSource: function (index) {
      if (index) {
        this.sources.splice((index - 1), 0, this.sources.splice(index, 1)[0])
      }
    },
    downSource: function (index) {
      if (index < this.sources.length) {
        this.sources.splice((index + 1), 0, this.sources.splice(index, 1)[0])
      }
    },
    addFeed: function (type) {
      let sourceitem = {
        'name': this.sourcename,
        'url': this.verifiedlink,
        'type': this.sourcetype
      }

      if (!this.checkSourceName()) {
        this.sources.push(sourceitem)
        this.verifiedlink = ''
        this.sourcelink = ''
        this.sourcename = ''
        this.verifymessage = ''
      }
    },
    addGoogle: function () {
      let sourceitem = {
        'name': this.sourcename,
        'url': 'https://news.google.com/news/rss/search/section/q/' + this.googlesearch + '/' + this.googlesearch + '?hl=en&ned=us',
        'type': this.sourcetype
      }

      if (!this.checkSourceName()) {
        this.sources.push(sourceitem)
        this.verifiedlink = ''
        this.sourcelink = ''
        this.sourcename = ''
        this.verifymessage = ''
        this.googlesearch = ''
      }
    },
    addBing: function () {
      let sourceitem = {
        'name': this.sourcename,
        'url': 'http://www.bing.com/news/search?q=' + this.bingsearch + '&format=rss',
        'type': this.sourcetype
      }

      if (!this.checkSourceName()) {
        this.sources.push(sourceitem)
        this.verifiedlink = ''
        this.sourcelink = ''
        this.sourcename = ''
        this.verifymessage = ''
        this.bingsearch = ''
      }
    },
    addYoutube: function () {
      let sourceitem = {
        'name': this.sourcename,
        'url': 'https://www.youtube.com/feeds/videos.xml?user=' + this.youtubechannel,
        'type': this.sourcetype
      }

      if (!this.checkSourceName()) {
        this.sources.push(sourceitem)
        this.verifiedlink = ''
        this.sourcelink = ''
        this.sourcename = ''
        this.verifymessage = ''
        this.youtubechannel = ''
      }
    },
    addBlade: function (event) {
      let feeditem = {}
      feeditem.name = this.bladename
      feeditem.retention = this.retention
      feeditem.maxitems = this.maxitems
      feeditem.host = this.website
      feeditem.rss = []
      feeditem.rss = this.sources
      feeditem.strategy = {}
      // feeditem.strategy.removeel = []
      feeditem.strategy.removeel = this.removeelarray()
      feeditem.strategy.useragent = this.useragent
      feeditem.strategy.miniuseragent = this.miniuseragent
      if (this.minibrowser) {
        feeditem.strategy.display = 'minioverride'
      }
      feeditem.uiorder = this.$store.getters.getFeeds.length + 1
      ipcRenderer.sendSync('ADD_FEED', feeditem)
      this.$store.commit('HOIST_FEEDS_INTO_STATE', ipcRenderer.sendSync('RETRIEVE_FEEDS_FROM_FEEDSDB'))
      this.bladename = ''
      this.retention = 2
      this.maxitems = 400
      this.website = ''
      this.$store.dispatch('setOptionsMenuSelected', 0)
    },
    verify: function (event) {
      /* eslint-disable */
      if (this.sourcelink.toLowerCase().indexOf('http://') === -1 && this.sourcelink.toLowerCase().indexOf('https://') === -1) {
        this.sourcelink = 'http://' + this.sourcelink;
      }

      let originallink = this.sourcelink

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
