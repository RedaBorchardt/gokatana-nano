import { ipcMain } from 'electron'
import feedstore from './feedsstore.js'

let url = require('url')

function instantContentMunch (link, articleSummaryCached) {
  let contents = require('electron').BrowserWindow.getFocusedWindow().webContents
  let request = require('request')

  detectStrategy(link).then(function (response) {
    if (response) {
      let displayStrategy = 'standard'
      let parsingStrategy = 'standard'
      let miniuseragent = 'standard'

      if (response.display) {
        displayStrategy = response.display
      }
      if (response.parser) {
        parsingStrategy = response.parser
      }
      if (response.miniuseragent) {
        miniuseragent = response.miniuseragent
      }

      let requestoptions = {
        uri: link,
        gzip: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
          'Host': url.parse(link).hostname,
          'Referer': 'https://facebook.com'
        }
      }
      contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Fetching: ' + link})
      request(requestoptions, function (error, response, body) {
        if (!error) {
          contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Article has been fetched'})

          // Different Parsing Options
          if (parsingStrategy === 'standard') {
            performStandardKatana()
          }

          if (parsingStrategy === 'dojo') {
            performDojoKatana()
          }

          /* eslint-disable */
          function performStandardKatana () {
            let articleObj = {}
            let unfluffextractor = require('unfluff')
            articleObj = unfluffextractor(body)
            articleObj.originalLink = link
            articleObj.displaystrategy = displayStrategy
            articleObj.parsingstrategy = parsingStrategy
            articleObj.miniuseragent = miniuseragent
            articleObj.articleSummaryCached = articleSummaryCached
            contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Article has been processed'})
            contents.send('PARSED_ARTICLE_READY', {'content': articleObj, 'doctype': 'unfluff'})
          }

          function performDojoKatana () {
            let read = require('node-readability')

            read(body, {cleanRulers:[
              function (obj, tag) {
                if (obj.getAttribute('href')) {
                  return false
                }
              }
            ]},
              function (err, article, meta) {
              if (!err) {
                let articleObj = {}
                articleObj.title = article.title
                articleObj.html = article.content
                articleObj.originalLink = link
                articleObj.displaystrategy = displayStrategy
                articleObj.parsingstrategy = parsingStrategy
                contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Article has been processed'})
                contents.send('PARSED_ARTICLE_READY', {'content': articleObj, 'doctype': 'dojo'})
                article.close()
              }
            })
          }
          /* eslint-enable */
        }
      })
    }
  })
}

function detectStrategy (link) {
  return new Promise(function (resolve, reject) {
    let hostname = url.parse(link).hostname
    feedstore.retrieveFeedsFromFeedsDB().then(function (feeds) {
      for (let i = 0; i < feeds.length; i++) {
        if (feeds[i].host) {
          if (hostname.includes(feeds[i].host)) {
            if (feeds[i].strategy) {
              resolve(feeds[i].strategy)
            }
          }
        }
      }
      resolve('{strategy: {}}')
    })
  })
}

ipcMain.on('DISPLAY_ARTICLE', function (event, link, articleSummaryCached) {
  instantContentMunch(link, articleSummaryCached)
})
