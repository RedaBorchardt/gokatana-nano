import { ipcMain } from 'electron'
let Datastore = require('nedb')
let path = require('path')
let Promise = require('promise')
let feedsdb = new Datastore({ filename: path.join(global.appFolders.config, 'feeds.db'), autoload: true })
let articledb = []
let download = require('download')
let moment = require('moment')
let contents = require('electron').BrowserWindow.fromId(1).webContents

function retrieveFeedFromGlobal (_id) {
  for (let i = 0; i < global.feeds.length; i++) {
    if (global.feeds[i]._id === _id) {
      return global.feeds[i]
    }
  }
  return 0
}

ipcMain.on('ADD_FEED', function (event, arg) {
  feedsdb.insert(arg, function (err, newDoc) {
    if (!err) {
      event.returnValue = true
    }
  })
})

ipcMain.on('UPDATE_FEED', function (event, arg) {
  feedsdb.update({_id: arg._id}, arg, function (err, newReplaced) {
    if (!err) {
      event.returnValue = true
    }
  })
})

ipcMain.on('DELETE_FEEDS', function (event, arg) {
  for (let i = 0; i < arg.length; i++) {
    articledb.splice(arg[i], 1)
    require('fs').unlinkSync(path.join(global.appFolders.data, arg[i] + '.db'))
  }
  feedsdb.remove({_id: { $in: arg }}, {multi: true}, function (error, numRemoved) {
    if (!error) {
      event.returnValue = numRemoved
    }
  })
})

ipcMain.on('RETRIEVE_FEEDS_FROM_FEEDSDB', function (event, arg) {
  feedsdb.find({}).sort({ uiorder: 1 }).exec(function (err, docs) {
    if (!err) {
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
                    global.feeds = docs
                    let foundid = ''
                    let x = docs.length
                    for (let i = 0; i < x; i++) {
                      docs[i].uiorder = i + 1
                    }
                    // Check active feed existence
                    let found = false
                    for (let i = 0; i < global.feeds.length; i++) {
                      if (global.feeds[i].selected) {
                        foundid = global.feeds[i]._id
                        contents.send('FORCE_REHOISTING_ARTICLES', foundid)
                        found = true
                        docs[i].selected = true
                      }
                    }
                    if (!found) {
                      docs[0].selected = true
                    }
                    global.feeds = docs
                    if (!found) {
                      contents.send('NEW_FEED_SELECTED', true)
                      // contents.send('FORCE_REHOISTING_ARTICLES', foundid)
                    }
                    event.returnValue = docs
                  }
                })
              }
            })
          }
        })
      } else {
        global.feeds = docs
        let foundid = ''
        let x = docs.length
        for (let i = 0; i < x; i++) {
          docs[i].uiorder = i + 1
        }
        // Check active feed existence
        let found = false
        for (let i = 0; i < global.feeds.length; i++) {
          if (global.feeds[i].selected) {
            foundid = docs[i]._id
            contents.send('FORCE_REHOISTING_ARTICLES', foundid)
            found = true
            docs[i].selected = true
          }
        }
        if (!found) {
          docs[0].selected = true
          foundid = docs[0]._id
        }
        global.feeds = docs
        if (!found) {
          contents.send('NEW_FEED_SELECTED', true)
          contents.send('FORCE_REHOISTING_ARTICLES', foundid)
        }
        event.returnValue = docs
      }
    } else {
      event.returnValue = 'catastrophy'
    }
  })
})

ipcMain.on('RETRIEVE_COUNT_FROM_ARTICLEDB', function (event, feedid) {
  let retention = retrieveFeedFromGlobal(feedid).retention
  articledb[feedid].count({date: {$gte: moment().startOf('day').subtract(retention, 'day')}, read: {$ne: 1}}, function (err, count) {
    if (!err) {
      event.returnValue = count
    }
  })
})

ipcMain.on('RETRIEVE_SUBFEED_COUNT', function (event, feedid, topicname) {
  let retention = retrieveFeedFromGlobal(feedid).retention
  articledb[feedid].count({date: {$gte: moment().startOf('day').subtract(retention, 'day')}, rssname: topicname, read: {$ne: 1}}, function (err, count) {
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

ipcMain.on('RETRIEVE_SUBFEED_ARTICLES', function (event, feedid, topicfilter) {
  let retention = retrieveFeedFromGlobal(feedid).retention
  articledb[feedid].find({date: {$gte: moment().startOf('day').subtract(retention, 'day')}, rssname: topicfilter}).sort({ date: -1 }).exec(function (err, docs) {
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

ipcMain.on('MARK_AS_READ', function (event, feedid, articleid) {
  articledb[feedid].update({_id: articleid}, {$set: {read: 1}}, {}, function (err, numReplaced) {
    if (!err) {
      event.returnValue = true
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

function compactAllFeedsDBs () {
  return new Promise(function (resolve, reject) {
    let icounter = 0
    innerLoop(icounter)
    function innerLoop (icounter) {
      if (icounter < global.feeds.length) {
        compactIndividualDB(global.feeds[icounter]).then(function (response) {
          innerLoop(icounter + 1)
        })
      } else {
        resolve('feeds compacted')
      }
    }
    resolve('done')
  })
}

function compactIndividualDB (feed) {
  return new Promise(function (resolve, reject) {
    articledb[feed._id].remove({date: {$lte: moment().startOf('day').subtract(feed.retention, 'day')}}, {multi: true}, function (err, numRemoved) {
      if (!err) {
        contents.send('PUSH_UPDATED_FEED_TO_CLIENT', feed._id)
        resolve('old entries removed')
      }
    })
  })
}

function removeMaxItemsAllFeedsDBs () {
  return new Promise(function (resolve, reject) {
    let icounter = 0
    outerLoop(icounter)
    function outerLoop (icounter) {
      if (icounter < global.feeds.length) {
        findItemsToMaxRemove(global.feeds[icounter]._id, global.feeds[icounter].maxitems).then(function (itemlist) {
          removeMaxItems(global.feeds[icounter]._id, itemlist).then(function (response) {
            outerLoop(icounter + 1)
          })
        })
      } else {
        resolve('max items removed')
      }
    }
    resolve('done')
  })
}

function findItemsToMaxRemove (feedid, limit) {
  return new Promise(function (resolve, reject) {
    let itemlist = []
    articledb[feedid].find({}).sort({ date: -1 }).exec(function (err, docs) {
      if (!err) {
        for (let i = 0; i < docs.length; i++) {
          if (i >= limit) {
            itemlist.push(docs[i]._id)
          }
        }
        resolve(itemlist)
      }
    })
  })
}

function removeMaxItems (feedid, itemlist) {
  return new Promise(function (resolve, reject) {
    let icounter = 0
    innerLoop(icounter)
    function innerLoop (icounter) {
      if (icounter < itemlist.length) {
        articledb[feedid].remove({_id: itemlist[icounter]}, {multi: true}, function (err, numRemoved) {
          if (!err) {
            innerLoop(icounter + 1)
          }
        })
      } else {
        contents.send('PUSH_UPDATED_FEED_TO_CLIENT', feedid)
        resolve('done')
      }
    }
  })
}

export default {
  retrieveFeedsFromFeedsDB,
  insertArticleIntoDB,
  compactAllFeedsDBs,
  removeMaxItemsAllFeedsDBs
}
