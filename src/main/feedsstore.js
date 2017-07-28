import { ipcMain } from 'electron'
let Datastore = require('nedb')
let path = require('path')
let Promise = require('promise')
let feedsdb = new Datastore({ filename: path.join(global.appFolders.config, 'feeds.db'), autoload: true })
let articledb = []
let download = require('download')
let moment = require('moment')

function retrieveFeedFromGlobal (_id) {
  for (let i = 0; i < global.feeds.length; i++) {
    if (global.feeds[i]._id === _id) {
      return global.feeds[i]
    }
  }
  return 0
}

ipcMain.on('RETRIEVE_FEEDS_FROM_FEEDSDB', function (event, arg) {
  feedsdb.find({}).sort({ uiorder: 1 }).exec(function (err, docs) {
    if (!err) {
      global.feeds = docs
      registerArticleDBHandles(docs)
      let iconDownloadList = []
      for (let i = 0; i < docs.length; i++) {
        if (!docs[i].icon) {
          iconDownloadList.push({url: 'https://www.google.com/s2/favicons?domain=' + docs[i].host, dest: docs[i]._id})
        }
      }
      if (iconDownloadList[0]) { // Entries have been found without an icon. Insert and redownload database
        Promise.all(iconDownloadList.map(x => download(x.url, path.join(global.appFolders.cache, x.dest)))).then(() => {
          let x = docs.length
          for (let i = 0; i < x; i++) {
            feedsdb.update({_id: docs[i]._id}, {$set: {icon: true}}, {}, function (err, numReplaced) {
              if (!err) {
                feedsdb.find({}).sort({ uiorder: 1 }).exec(function (err, docs) {
                  if (!err) {
                    event.returnValue = docs
                  }
                })
              }
            })
          }
        })
      } else {
        event.returnValue = docs
      }
    } else {
      event.returnValue = 'catastrophy'
    }
  })
})

ipcMain.on('RETRIEVE_COUNT_FROM_ARTICLEDB', function (event, feedid) {
  let retention = retrieveFeedFromGlobal(feedid).retention
  articledb[feedid].count({date: {$gte: moment().startOf('day').subtract(retention, 'day')}}, function (err, count) {
    if (!err) {
      event.returnValue = count
    }
  })
})

ipcMain.on('RETRIEVE_ARTICLES', function (event, feedid) {
  let retention = retrieveFeedFromGlobal(feedid).retention
  articledb[feedid].find({date: {$gte: moment().startOf('day').subtract(retention, 'day')}}).sort({ date: -1 }).exec(function (err, docs) {
    if (!err) {
      event.returnValue = docs
    }
  })
})

ipcMain.on('SAVE_NEW_FEEDS_UIORDER', function (event, obj) {
  let x = obj.length
  for (let i = 0; i < x; i++) {
    feedsdb.update({_id: obj[i]._id}, {$set: {uiorder: obj[i].uiorder}}, {}, function (err, numReplaced) {
      if (!err) {
        return 'updated list'
      }
    })
  }
})

function registerArticleDBHandles (docs) {
  for (let i = 0; i < docs.length; i++) {
    articledb[docs[i]._id] = new Datastore({ filename: path.join(global.appFolders.data, docs[i]._id + '.db'), autoload: true })
  }
}

function retrieveFeedsFromFeedsDB () {
  return new Promise(function (resolve, reject) {
    feedsdb.find({}, function (err, docs) {
      if (!err) {
        resolve(docs)
      }
    })
  })
}

function insertArticleIntoDB (article, feedid) {
  return new Promise(function (resolve, reject) {
    article._feedid = feedid
    articledb[feedid].insert(article, function (err, newDoc) {
      if (!err) {
        resolve('added')
      } else {
        resolve('skipped ' + err)
      }
    })
  })
}

export default {
  retrieveFeedsFromFeedsDB,
  insertArticleIntoDB
}
