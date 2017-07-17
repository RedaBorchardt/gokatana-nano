import { ipcMain } from 'electron'
let Datastore = require('nedb')
let path = require('path')
let Promise = require('promise')
let feedsdb = new Datastore({ filename: path.join(global.appFolders.config, 'feeds.db'), autoload: true })
let articledb = []

ipcMain.on('RETRIEVE_FEEDS_FROM_FEEDSDB', function (event, arg) {
  feedsdb.find({}, function (err, docs) {
    if (!err) {
      registerArticleDBHandles(docs)
      event.returnValue = docs
    } else {
      event.returnValue = 'catastrophy'
    }
  })
})

ipcMain.on('RETRIEVE_COUNT_FROM_ARTICLEDB', function (event, feedid) {
  articledb[feedid].count({}, function (err, count) {
    if (!err) {
      event.returnValue = count
    }
  })
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
    articledb[feedid].insert(article, function (err, newDoc) {
      if (!err) {
        resolve('Document Inserted into ' + feedid + ' database')
      } else {
        resolve('Error inserting article. Does it already exist?: ' + err)
      }
    })
  })
}

export default {
  retrieveFeedsFromFeedsDB,
  insertArticleIntoDB
}
