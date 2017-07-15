import path from 'path'
let fs = require('fs')
let jsonfile = require('jsonfile')

let foundAppFolder = false
let foundDataFolder = false
let foundArchiveFolder = false
let foundConfigFolder = false
let foundConfigFile = false
let foundCacheFolder = false
let foundFeedsDB = false
let foundTmpFolder = false

startupCheck()

// Check Main Folder
function startupCheck () {
  if (!fs.existsSync(global.appFolders.main)) {
    checkStage1()
  } else {
    foundAppFolder = true
    checkStage1()
  }
}

// Create Main Folder If Necessary
function checkStage1 () {
  if (!foundAppFolder) {
    fs.mkdir(global.appFolders.main, function (err) {
      if (!err) {
        foundAppFolder = true
        checkStage2()
      }
    })
  } else {
    checkStage2()
  }
}

// Check Data Folder
function checkStage2 () {
  if (!fs.existsSync(global.appFolders.data)) {
    checkStage3()
  } else {
    foundDataFolder = true
    checkStage3()
  }
}

// Create Data Folder If Necessary
function checkStage3 () {
  if (!foundDataFolder) {
    fs.mkdir(global.appFolders.data, function (err) {
      if (!err) {
        foundDataFolder = true
        checkStage4()
      }
    })
  } else {
    checkStage4()
  }
}

// Check Archive Foler
function checkStage4 () {
  if (!fs.existsSync(path.join(global.appFolders.data, 'archive'))) {
    checkStage5()
  } else {
    foundArchiveFolder = true
    checkStage5()
  }
}

// Create Archive Folder If Necessary
function checkStage5 () {
  if (!foundArchiveFolder) {
    fs.mkdir(path.join(global.appFolders.data, 'archive'), function (err) {
      if (!err) {
        foundArchiveFolder = true
        checkStage6()
      }
    })
  } else {
    checkStage6()
  }
}

// Check Config Folder
function checkStage6 () {
  if (!fs.existsSync(global.appFolders.config)) {
    checkStage7()
  } else {
    foundConfigFolder = true
    checkStage7()
  }
}

// Create Config Folder If Necessary
function checkStage7 () {
  if (!foundConfigFolder) {
    fs.mkdir(global.appFolders.config, function (err) {
      if (!err) {
        foundConfigFolder = true
        checkStage8()
      }
    })
  } else {
    checkStage8()
  }
}

// Check Cache Folder
function checkStage8 () {
  if (!fs.existsSync(global.appFolders.cache)) {
    checkStage9()
  } else {
    foundCacheFolder = true
    checkStage9()
  }
}

// Create Config Folder If Necessary
function checkStage9 () {
  if (!foundCacheFolder) {
    fs.mkdir(global.appFolders.cache, function (err) {
      if (!err) {
        foundCacheFolder = true
        checkStage10()
      }
    })
  } else {
    checkStage10()
  }
}

// Check Tmp Folder
function checkStage10 () {
  if (!fs.existsSync(global.appFolders.tmp)) {
    checkStage11()
  } else {
    foundTmpFolder = true
    checkStage11()
  }
}

// Create Tmp Folder If Necessary
function checkStage11 () {
  if (!foundTmpFolder) {
    fs.mkdir(global.appFolders.tmp, function (err) {
      if (!err) {
        foundTmpFolder = true
        checkStage12()
      }
    })
  } else {
    checkStage12()
  }
}

// Check config.json
function checkStage12 () {
  if (!fs.existsSync(path.join(global.appFolders.config, 'config.json'))) {
    checkStage13()
  } else {
    foundConfigFile = true
    checkStage13()
  }
}

// Create default config.json file if necessary
function checkStage13 () {
  if (!foundConfigFile) {
    let defaultConfig = {
      ui: {
        theme: 'PhotonDarwin'
      }
    }
    jsonfile.writeFile(path.join(global.appFolders.config, 'config.json'), defaultConfig, {spaces: 1}, function (err) {
      if (!err) {
        foundConfigFile = true
        checkStage14()
      }
    })
  } else {
    checkStage14()
  }
}

// Check for feeds.db
function checkStage14 () {
  if (!fs.existsSync(path.join(global.appFolders.config, 'feeds.db'))) {
    checkStage15()
  } else {
    foundFeedsDB = true
    checkStage15()
  }
}

// Create Default FeedsDB if necessary
function checkStage15 () {
  if (!foundFeedsDB) {
    var Datastore = require('nedb')
    var db = new Datastore({ filename: path.join(global.appFolders.config, 'feeds.db'), autoload: true })
    var samplefeeds = [{ name: 'The Guardian', rss: 'http://www.theguardian.com/rss' },
                       { name: 'The Independent', rss: 'http://www.independent.co.uk/rss' },
                       { name: 'Der Spiegel', rss: 'http://www.spiegel.de/schlagzeilen/tops/index.rss' },
                       { name: 'Standard', rss: 'http://www.standard.co.uk/rss' },
                       { name: 'CNN', rss: 'http://rss.cnn.com/rss/cnn_latest.rss' },
                       { name: 'Daily Mail', rss: 'http://www.dailymail.co.uk/articles.rss' },
                       { name: 'Focus', rss: 'http://rss.focus.de/fol/XML/rss_folnews.xml' },
                       { name: 'Kotaku', rss: 'http://www.kotaku.com/rss' }]

    db.insert(samplefeeds, function (err, newDoc) {
      if (!err) {
        foundFeedsDB = true
        checkStage16()
      }

      // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
    })
  } else {
    checkStage16()
  }
}

function checkStage16 () {
  console.log('All startup checks have been concluded')
}
