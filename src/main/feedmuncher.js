import {ipcMain} from 'electron'
import feedstore from './feedsstore.js'
let contents = require('electron').BrowserWindow.getFocusedWindow().webContents

let FeedParser = require('feedparser')
let request = require('request')

ipcMain.on('GLOBAL_FETCH_ARTICLES', function (event, feedid) {
  fetchAllArticleHeadlines()
})

ipcMain.on('ABORT', function (event) {
  global.ABORT = true
})

function fetchAllArticleHeadlines () {
  global.BUSY_FETCHINGARTICLES = true
  contents.send('BUSY_FETCHINGARTICLES', true)
  feedstore.retrieveFeedsFromFeedsDB().then(function (feeds) {
    let x = 0
    let i = 0
    processingLoop(feeds, true) // TODO watch it here in case the feeds DB is empty!

    function processingLoop (feeds, stayonthisfeed) {
      if (!stayonthisfeed) {
        i = 0
        x += 1
      }
      if (x < feeds.length) {
        if (!global.ABORT) {
          innerProcessingLoop(feeds)
        } else {
          x = 1000000
          processingLoop(feeds, false)
        }
      } else {
        global.BUSY_FETCHINGARTICLES = false
        contents.send('BUSY_FETCHINGARTICLES', false)
        contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'All feeds updated'})
        global.BUSY_COMPACTING = true
        contents.send('BUSY_COMPACTING', true)
        contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Busy compacting feeds'})
        feedstore.compactAllFeedsDBs().then(function (response) {
          feedstore.removeMaxItemsAllFeedsDBs().then(function (response) {
            global.BUSY_COMPACTING = false
            contents.send('BUSY_COMPACTING', false)
            contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Everything is up to date'})
            global.ABORT = false
          })
        })
      }
    }

    function innerProcessingLoop (feeds) { // Iterate through subfeeds
      downloadThenParseRSSFeed(feeds[x].rss[i].url, feeds[x].rss[i].name, feeds[x]._id, feeds[x].name).then(function (response) {
        contents.send('PUSH_UPDATED_FEED_TO_CLIENT', feeds[x]._id)
        contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': response})
        i += 1
        if (i < feeds[x].rss.length) {
          processingLoop(feeds, true)
        } else {
          processingLoop(feeds, false)
        }
      }, function (response) {
        contents.send('CLIENT_LOG', {type: 'green', time: Date(), message: response})
        i += 1
        if (i < feeds[x].rss.length) {
          processingLoop(feeds, true)
        } else {
          processingLoop(feeds, false)
        }
      })
    }
  })
}

function downloadThenParseRSSFeed (rssurl, rssname, _feedid, feedname) {
  return new Promise(function (resolve, reject) {
    if (global.ONLINE_STATUS === 'offline') {
      reject(new Error('Application is offline'))
    }

    let req = request(rssurl)
    let feedparser = new FeedParser()

    req.on('error', function (error) {
      if (error) {
        reject(new Error('failed to download feed ' + rssurl + ' ' + _feedid + error))
      }
    })

    req.on('response', function (res) {
      let stream = this // this is the steeam itself

      if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'))
      } else {
        stream.pipe(feedparser)
      }
    })

    feedparser.on('error', function (error) {
      reject(new Error('An error has occured parsing the feed ' + error))
    })

    let processedcount = 0
    let dbinsertedcount = 0
    feedparser.on('readable', function () {
      /* eslint-disable */

      let stream = this // this is the feedparser which is a stream
      let meta = this.meta
      let item

      while (item = stream.read()) {
        /* Check for nulls */
        if (!item.summary) item.summary = 'no content'
        if (!item.title) item.title = 'no content'
        if (!item.categories) item.categories = 'no content'
        if (!item.date) item.date = 'not content'
        if (!item.author) item.author = 'no content'
        if (!item.link) item.link = 'no content'
        if (!item.image) item.image = 0

        if (item.summary === 'no content') {
          if (item['media:group']['media:description']['#']) {
            item.summary = item['media:group']['media:description']['#']
          }
        }

        processedcount += 1
        let article = {
          sitename: feedname,
          rssname: rssname,
          title: require('he').decode(item.title).replace("<![CDATA[", "").replace("]]>", "").replace(/<(?:.|\n)*?>/gm, '').replace(/(\r\n|\n|\r)/gm).replace(/(<|.&lt;)(?:.|\n)*?(\/a&gt|>)/gm, '').replace(/undefined    undefined/, ''),
          link: item.link,
          summary: require('he').decode(item.summary).replace("<![CDATA[", "").replace("]]>", "").replace(/<(?:.|\n)*?>/gm, '').replace(/(\r\n|\n|\r)/gm).replace(/(<|.&lt;)(?:.|\n)*?(\/a&gt|>)/gm, '').replace(/undefined    undefined/, ''),
          categories: item.categories,
          date: item.date,
          author: item.author,
          image: item.image,
          _id: item.guid
        }

        feedstore.insertArticleIntoDB(article, _feedid).then( function (result) {
          if (result === 'added') {
            dbinsertedcount += 1
          }
        })

      }
    })

    feedparser.on('end', function(error) {
      if (!error) {
        resolve(processedcount + ' headlines processed from: ' + rssurl + ' ' + dbinsertedcount + ' new item(s) found')
      }
    });
  })
}
