import { ipcMain } from 'electron'
// let contents = require('electron').BrowserWindow.getFocusedWindow().webContents
let Datastore = require('nedb')
let path = require('path')

ipcMain.on('RETRIEVE_FEEDS_FROM_FEEDSDB', function (event, arg) {
  let feedsdb = new Datastore({ filename: path.join(global.appFolders.config, 'feeds.db'), autoload: true })
  feedsdb.find({}, function (err, docs) {
    if (!err) {
      event.returnValue = docs
    } else {
      event.returnValue = 'catastrophy'
    }
  })
})
