import path from 'path'
let fs = require('fs')
let jsonfile = require('jsonfile')
let contents = require('electron').BrowserWindow.getFocusedWindow().webContents

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
    contents.send('startup_application_message', 'Default user space folder could not be found')
    checkStage1()
  } else {
    foundAppFolder = true
    contents.send('startup_application_message', 'Default user space folder has been found ')
    checkStage1()
  }
}

// Create Main Folder If Necessary
function checkStage1 () {
  if (!foundAppFolder) {
    fs.mkdir(global.appFolders.main, function (err) {
      if (!err) {
        foundAppFolder = true
        contents.send('startup_application_message', 'Default user space folder created')
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
    contents.send('startup_application_message', 'Data folder could not be found')
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
        contents.send('startup_application_message', 'Default data folder created')
        checkStage4()
      }
    })
  } else {
    contents.send('startup_application_message', 'Default data folder found')
    checkStage4()
  }
}

// Check Archive Foler
function checkStage4 () {
  if (!fs.existsSync(path.join(global.appFolders.data, 'archive'))) {
    contents.send('startup_application_message', 'Archive folder could not be found')
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
        contents.send('startup_application_message', 'Default archive folder created')
        checkStage6()
      }
    })
  } else {
    contents.send('startup_application_message', 'Default archive folder found')
    checkStage6()
  }
}

// Check Config Folder
function checkStage6 () {
  if (!fs.existsSync(global.appFolders.config)) {
    contents.send('startup_application_message', 'Config folder could not be found')
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
        contents.send('startup_application_message', 'Default config folder created')
        checkStage8()
      }
    })
  } else {
    contents.send('startup_application_message', 'Default config folder found')
    checkStage8()
  }
}

// Check Cache Folder
function checkStage8 () {
  if (!fs.existsSync(global.appFolders.cache)) {
    contents.send('startup_application_message', 'Cache folder could not be found')
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
        contents.send('startup_application_message', 'Default cache folder created')
        checkStage10()
      }
    })
  } else {
    contents.send('startup_application_message', 'Default cache folder found')
    checkStage10()
  }
}

// Check Tmp Folder
function checkStage10 () {
  if (!fs.existsSync(global.appFolders.tmp)) {
    contents.send('startup_application_message', 'Tmp folder could not be found')
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
        contents.send('startup_application_message', 'Default tmp folder created')
        checkStage12()
      }
    })
  } else {
    contents.send('startup_application_message', 'Default tmp folder found')
    checkStage12()
  }
}

// Check config.json
function checkStage12 () {
  if (!fs.existsSync(path.join(global.appFolders.config, 'config.json'))) {
    contents.send('startup_application_message', 'Configuration file could not be found')
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
        contents.send('startup_application_message', 'Default configuration file created')
        checkStage14()
      }
    })
  } else {
    contents.send('startup_application_message', 'Configuration file found')
    checkStage14()
  }
}

// Check for feeds.db
function checkStage14 () {
  if (!fs.existsSync(path.join(global.appFolders.config, 'feeds.db'))) {
    contents.send('startup_application_message', 'Feeds database could not be found')
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
                       { name: 'Evening Standard', rss: 'http://www.standard.co.uk/rss' },
                       { name: 'CNN', rss: 'http://rss.cnn.com/rss/cnn_latest.rss' },
                       { name: 'Daily Mail', rss: 'http://www.dailymail.co.uk/articles.rss' },
                       { name: 'Focus', rss: 'http://rss.focus.de/fol/XML/rss_folnews.xml' },
                       { name: 'Kotaku', rss: 'http://www.kotaku.com/rss' }]

    db.insert(samplefeeds, function (err, newDoc) {
      if (!err) {
        foundFeedsDB = true
        contents.send('startup_application_message', 'Default feeds database created')
        checkStage16()
      }
    })
  } else {
    contents.send('startup_application_message', 'Feeds database found')
    checkStage16()
  }
}

function checkStage16 () {
  contents.send('startup_application_message', 'All checks have been performed. Entering GoKatana...')
  launchAll()
}

function launchAll () {
  require('./feedsstore.js')
  require('./feedmuncher.js')
}
