// let feedparser = require('feedparser')
// let request = require('request')
// let Datastore = require('nedb')
// let path = require('path')

import feedstore from './feedsstore.js'
feedstore.retrieveFeedsFromFeedsDB().then(function (feeds) {
  for (let i = 0; i < feeds.length; i++) {
    console.log(feeds[i]._id)
  }
})
