import { ipcMain } from 'electron'

function instantContentMunch (link) {
  let contents = require('electron').BrowserWindow.getFocusedWindow().webContents
  let request = require('request')
  let url = require('url')

  let parsingStrategy = 'standard'

  if (parsingStrategy === 'standard') {
    let unfluffextractor = require('unfluff')
    let requestoptions = {
      url: link,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'host': url.parse(link).hostname
      }
    }
    contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Fetching: ' + link})
    request(requestoptions, function (error, response, body) {
      if (!error) {
        contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Article has been fetched'})
        let articleObj = unfluffextractor(body)
        articleObj.originalLink = link
        contents.send('CLIENT_LOG', {type: 'green', time: Date(), 'message': 'Article has been savagely chopped into pieces'})
        contents.send('PARSED_ARTICLE_READY', {'content': articleObj, 'doctype': 'unfluff'})
      }
    })
  }
}

ipcMain.on('DISPLAY_ARTICLE', function (event, link) {
  instantContentMunch(link)
})
