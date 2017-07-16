import { ipcMain } from 'electron'
let Datastore = require('nedb')
let path = require('path')
let Promise = require('promise')

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

function retrieveFeedsFromFeedsDB () {
  return new Promise(function (resolve, reject) {
    let feedsdb = new Datastore({ filename: path.join(global.appFolders.config, 'feeds.db'), autoload: true })
    feedsdb.find({}, function (err, docs) {
      if (!err) {
        resolve(docs)
      }
    })
  })
}

export default {
  retrieveFeedsFromFeedsDB
}
