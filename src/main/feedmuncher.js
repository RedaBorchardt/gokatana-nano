import {ipcMain} from 'electron'
import feedstore from './feedsstore.js'
let contents = require('electron').BrowserWindow.getFocusedWindow().webContents

let FeedParser = require('feedparser')
let request = require('request')

ipcMain.on('GLOBAL_FETCH_ARTICLES', function (event, feedid) {
  fetchAllArticleHeadlines()
})

function fetchAllArticleHeadlines () {
  global.BUSY_FETCHINGARTICLES = true
  contents.send('BUSY_FETCHINGARTICLES', true)
  feedstore.retrieveFeedsFromFeedsDB().then(function (feeds) {
    let i = 0
    processingLoop() // TODO watch it here in case the feeds DB is empty!

    function processingLoop () {
      downloadThenParseRSSFeed(feeds[i].rss, feeds[i]._id).then(function (response) {
        contents.send('PUSH_UPDATED_FEED_TO_CLIENT', feeds[i]._id)
        i += 1
        if (i < feeds.length) {
          processingLoop()
        } else {
          global.BUSY_FETCHINGARTICLES = false
          contents.send('BUSY_FETCHINGARTICLES', false)
        }
      })
    }
  })
}

function downloadThenParseRSSFeed (rssurl, _feedid) {
  return new Promise(function (resolve, reject) {
    let req = request(rssurl)
    let feedparser = new FeedParser()

    req.on('error', function (error) {
      if (error) {
        console.log('unable to download feed ' + rssurl)
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
      console.log('An error has occured parsing the feed ' + error)
    })

    let processedcount = 0
    feedparser.on('readable', function () {
      /* eslint-disable */

      let stream = this // this is the feedparser which is a stream
      let meta = this.meta
      let item

      while (item = stream.read()) {
        processedcount += 1
        let article = {
          title: item.title,
          link: item.link,
          summary: item.summary,
          categories: item.categories,
          date: item.date,
          author: item.author,
          _id: item.guid
        }

        feedstore.insertArticleIntoDB(article, _feedid).then( function (result) {
          // console.log(result)
        })

      }
    })

    feedparser.on('end', function(error) {
      if (!error) {
        resolve(processedcount + ' Items processed from: ' + rssurl)
      }
    });
  })
}
