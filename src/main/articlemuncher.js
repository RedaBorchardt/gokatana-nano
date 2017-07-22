import { ipcMain } from 'electron'
import feedstore from './feedsstore.js'

let url = require('url')

function instantContentMunch (link) {
  let contents = require('electron').BrowserWindow.getFocusedWindow().webContents
  let request = require('request')

  detectDisplayStrategy(link).then(function (response) {
    if (response) {
      let displayStrategy = response

      let parsingStrategy = 'standard'

      let unfluffextractor = require('unfluff')
      let requestoptions = {
        url: link,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
          'Host': url.parse(link).hostname,
          'Referer': 'https://news.google.com/'
        }
      }
      contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Fetching: ' + link})
      request(requestoptions, function (error, response, body) {
        if (!error) {
          contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Article has been fetched'})

          let articleObj = ''

          if (parsingStrategy === 'standard') {
            articleObj = unfluffextractor(body)
          }

          articleObj.originalLink = link
          articleObj.displaystrategy = displayStrategy
          contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Article has been processed'})
          contents.send('PARSED_ARTICLE_READY', {'content': articleObj, 'doctype': 'unfluff'})
        }
      })
    }
  })
}

function detectDisplayStrategy (link) {
  return new Promise(function (resolve, reject) {
    let hostname = url.parse(link).hostname
    feedstore.retrieveFeedsFromFeedsDB().then(function (feeds) {
      for (let i = 0; i < feeds.length; i++) {
        if (feeds[i].host) {
          if (hostname.includes(feeds[i].host)) {
            resolve(feeds[i].displaystrategy)
          }
        }
      }
      resolve('standard')
    })
  })
}

ipcMain.on('DISPLAY_ARTICLE', function (event, link) {
  instantContentMunch(link)
})
