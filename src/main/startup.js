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
    /* eslint-disable */
    var samplefeeds = [

                       { name: 'The Independent', retention: 7, maxitems: 400, uiorder: 1, rss: [{name: 'Latest News', url: 'http://www.independent.co.uk/rss'}], strategy: {useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'}, host: 'www.independent.co.uk'},
                       { name: 'The Guardian', retention: 7, maxitems: 400, uiorder: 2, rss: [{name: 'UK News', url: 'http://www.theguardian.com/uk/rss'},
                       {name: 'Politics', url: 'http://www.theguardian.com/politics/rss'},
                       {name: 'World', url: 'http://www.theguardian.com/world/rss'},
                       {name: 'Sport', url: 'http://www.theguardian.com/uk/sport/rss'},
                       {name: 'Football', url: 'http://www.theguardian.com/football/rss'},
                       {name: 'Culture', url: 'http://www.theguardian.com/uk/culture/rss'},
                       {name: 'Business', url: 'http://www.theguardian.com/uk/business/rss'},
                       {name: 'Fashion', url: 'http://www.theguardian.com/fashion/rss'},
                       {name: 'Environment', url: 'http://www.theguardian.com/uk/environment/rss'},
                       {name: 'Tech', url: 'http://www.theguardian.com/uk/technology/rss'},
                       {name: 'Travel', url: 'http://www.theguardian.com/uk/travel/rss'}
                      ], strategy: {removeel: ['meta[name="description"]','.tonal__standfirst']}, host: 'www.theguardian.com' },
                       { name: 'TechCrunch', retention: 7, maxitems: 400, uiorder: 3,
                       rss: [{name: 'Top News', url: 'http://feeds.feedburner.com/TechCrunch/'},
                       {name: 'Startups', url: 'http://feeds.feedburner.com/TechCrunch/startups'},
                       {name: 'Fundings & Exits', url: 'http://feeds.feedburner.com/TechCrunch/fundings-exits'},
                       {name: 'Social', url: 'http://feeds.feedburner.com/TechCrunch/social'},
                       {name: 'Mobile', url: 'http://feeds.feedburner.com/Mobilecrunch'},
                       {name: 'Gadgets', url: 'http://feeds.feedburner.com/crunchgear'},
                       {name: 'Europe', url: 'http://feeds.feedburner.com/Techcrunch/europe'},
                       {name: 'Enterprise / IT', url: 'http://feeds.feedburner.com/TechCrunchIT'},
                       {name: 'GreenTech', url: 'http://feeds.feedburner.com/TechCrunch/greentech'}
                     ], host: 'www.techcrunch.com'},
                       { name: 'Der Spiegel', retention: 7, maxitems: 400, uiorder: 4,
                       rss: [{name: 'Schlagzeilen', url: 'http://www.spiegel.de/schlagzeilen/index.rss'},
                       {name: 'Politik', url: 'http://www.spiegel.de/politik/index.rss'},
                       {name: 'Wirtschaft', url: 'http://www.spiegel.de/wirtschaft/index.rss'},
                       {name: 'Sport', url: 'http://www.spiegel.de/sport/index.rss'},
                       {name: 'Netzwelt', url: 'http://www.spiegel.de/netzwelt/index.rss'},
                       {name: 'Wissenschaft', url: 'http://www.spiegel.de/wissenschaft/index.rss'},
                       {name: 'Gesundheit', url: 'http://www.spiegel.de/gesundheit/index.rss'},
                       {name: 'Karriere', url: 'http://www.spiegel.de/karriere/index.rss'},
                       {name: 'Uni Spiegel', url: 'http://www.spiegel.de/unispiegel/index.rss'},
                       {name: 'Reise', url: 'http://www.spiegel.de/reise/index.rss'},
                       {name: 'Auto', url: 'http://www.spiegel.de/auto/index.rss'},
                       {name: 'Video', url: 'http://www.spiegel.de/video/index.rss'}
                     ], host: 'www.spiegel.de' },
                       { name: 'Sky News', retention: 7, maxitems: 400, uiorder: 4,
                       rss: [{name: 'Top News', url: 'http://feeds.skynews.com/feeds/rss/home.xml'},
                       {name: 'UK', url: 'http://feeds.skynews.com/feeds/rss/uk.xml'},
                       {name: 'World', url: 'http://feeds.skynews.com/feeds/rss/world.xml'},
                       {name: 'US', url: 'http://feeds.skynews.com/feeds/rss/us.xml'},
                       {name: 'Business', url: 'http://feeds.skynews.com/feeds/rss/business.xml'},
                       {name: 'Politics', url: 'http://feeds.skynews.com/feeds/rss/politics.xml'},
                       {name: 'Technology', url: 'http://feeds.skynews.com/feeds/rss/technology.xml'},
                       {name: 'Entertainment', url: 'http://feeds.skynews.com/feeds/rss/entertainment.xml'},
                       {name: 'Strange News', url: 'http://feeds.skynews.com/feeds/rss/strange.xml'},
                     ], host: 'news.sky.com' },
                       { name: 'Evening Standard', retention: 7, uiorder: 5, rss: [{name: 'Latest News', url: 'http://www.standard.co.uk/rss'}], strategy: {useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'}, host: 'www.standard.co.uk' },
                       { name: 'Focus', retention: 7, uiorder: 8,
                       rss: [{name: 'Schlagzeilen', url: 'http://rss.focus.de/'},
                       {name: 'Politik', url: 'http://rss.focus.de/politik/'},
                       {name: 'Wissen', url: 'http://rss.focus.de/wissen/'},
                       {name: 'Gesundheit', url: 'http://rss.focus.de/gesundheit/'},
                       {name: 'Panorama', url: 'http://rss.focus.de/panorama/'},
                       {name: 'Sport', url: 'http://rss.focus.de/sport/'},
                       {name: 'Digital', url: 'http://rss.focus.de/digital/'},
                       {name: 'Finanzen', url: 'http://rss.focus.de/finanzen'}
                     ], strategy: {removeel: ['meta[name="description"]','meta[name="twitter:description"]','meta[property="og:description"]']},host: 'www.focus.de' },
                       { name: 'Kotaku', retention: 7, maxitems: 400, uiorder: 9, rss: [{name: 'Latest News', url: 'http://www.kotaku.com/rss'}], host: 'www.kotaku.com' },
                       { name: 'Le Monde', retention: 7, maxitems: 400, uiorder: 10, rss: [{name: 'Latest News', url: 'http://www.lemonde.fr/rss/une.xml'}], strategy: {removeel:['nav','#alerte_tracking','.bloc_signature','.fixed-header-title','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]', 'meta[name="twitter:description"]']}, host: 'www.lemonde.fr' },
                       { name: 'Financial Times', retention: 7, maxitems: 400, uiorder: 12, rss: [{name: 'Latest News', url: 'http://search.ft.com/openSearch/atom/?searchTerms=&sortBy=date'}], strategy: {display: 'minioverride'}, host: 'ft.com' },
                       { name: 'Russia Today', retention: 7, maxitems: 400, uiorder: 13, rss: [{name: 'Latest News', url: 'http://www.rt.com/rss'}], host: 'www.rt.com' },
                       { name: 'Gizmodo', retention: 7, maxitems: 400, uiorder: 14, rss: [{name: 'Latest News', url: 'http://gizmodo.com/rss'}], host: 'www.gizmodo.com' },
                       { name: 'Brexit', retention: 7, maxitems: 400, uiorder: 15, rss: [{name: 'Latest News', url: 'https://news.google.com/news/rss/search/section/q/brexit/brexit?hl=en-GB&ned=uk'}], host: 'www.gmail.com' },
                       { name: 'TED Talks', retention: 365, maxitems: 400, uiorder: 17, rss: [{name: 'Latest News', url: 'https://pa.tedcdn.com/feeds/talks.rss'}], host: 'www.ted.com' },
                       { name: 'TechRadar', retention: 7, maxitems: 400, uiorder: 18, rss: [{name: 'Latest News', url: 'http://www.techradar.com/rss'}], host: 'www.techradar.com' },
                       { name: 'Lifehacker', retention: 7, maxitems: 400, uiorder: 19, rss: [{name: 'Latest News', url: 'http://lifehacker.com/rss'}], host: 'www.lifehacker.com' },
                       { name: 'BBC World', retention: 7, maxitems: 400, uiorder: 20, rss: [{name: 'Latest News', url: 'http://feeds.bbci.co.uk/news/world/rss.xml?edition=uk'}], host: 'www.bbc.co.uk' },
                       { name: 'New York Times', retention: 7, maxitems: 400, uiorder: 27, rss: [{name: 'Latest News', url: 'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'}], host: 'www.nytimes.com' },
                       { name: 'The Epoch Times', retention: 7, maxitems: 400, uiorder: 29, rss: [{name: 'Latest News', url: 'http://www.theepochtimes.com/n3/c/world/feed/'}], host: 'www.theepochtimes.com'},
                       { name: 'Huffington Post', retention: 7, maxitems: 400, uiorder: 27, rss: [{name: 'Latest News', url: 'http://www.huffingtonpost.co.uk/feeds/news.xml'}], strategy: {display: 'minioverride'}, host: 'www.huffingtonpost.co.uk'},
                       { name: 'Wall Street Journal', retention: 7, maxitems: 400, uiorder: 28, rss: [{name: 'Latest News', url: 'http://www.wsj.com/xml/rss/3_7085.xml'}], host: 'www.wsj.com'},
                       { name: 'Reuters', retention: 7, maxitems: 400, uiorder: 29, rss: [{name: 'Latest News', url: 'http://feeds.reuters.com/reuters/UKTopNews'}], host: 'www.reuters.com'},
                       { name: 'CNBC', retention: 7, maxitems: 400, uiorder: 30, rss: [{name: 'Latest News', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html'}], host: 'www.cnbc.com'},
                       { name: 'Daily Express', retention: 7, maxitems: 400, uiorder: 31, rss: [{name: 'Latest News', url: 'http://feeds.feedburner.com/daily-express-news-showbiz'}], host: 'www.express.co.uk'},
                       { name: 'Daily Star', retention: 7, maxitems: 400, uiorder: 32, rss: [{name: 'Latest News', url: 'http://feeds.feedburner.com/daily-star-Latest-News'}], host: 'www.dailystar.co.uk'},
                       { name: 'CBS News', retention: 7, maxitems: 400, uiorder: 33, rss: [{name: 'Latest News', url: 'http://www.cbsnews.com/latest/rss/main'}], host: 'www.cbsnews.com'},
                       { name: 'New York Post', retention: 7, maxitems: 400, uiorder: 34, rss: [{name: 'Latest News', url: 'http://nypost.com/feed/'}], host: 'www.nypost.com'},
                       { name: 'USA Today', retention: 7, maxitems: 400, uiorder: 35, rss: [{name: 'Latest News', url: 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories'}], host: 'usatoday.com'},
                       { name: 'The Daily Beast', retention: 7, maxitems: 400, uiorder: 36, rss: [{name: 'Latest News', url: 'http://feeds.feedburner.com/thedailybeast/articles'}], host: 'dailybeast.com'},
                       { name: 'Bild', retention: 7, maxitems: 400, uiorder: 37, rss: [{name: 'Latest News', url: 'http://www.bild.de/rssfeeds/vw-alles/vw-alles-26970192,sort=1,view=rss2.bild.xml'}], strategy: {removeel: ['.main-nav']}, host: 'bild.de'},
                       { name: 'Kyiv Post', retention: 7, maxitems: 400, uiorder: 38, rss: [{name: 'Latest News', url: 'https://www.kyivpost.com/feed'}], host: 'kyivpost.com'},
                       { name: 'Prague Post', retention: 7, maxitems: 400, uiorder: 39, rss: [{name: 'Latest News', url: 'https://www.praguepost.com/feed'}], host: 'praguepost.com'},
                       { name: 'Al Jazeera', retention: 7, maxitems: 400, uiorder: 40, rss: [{name: 'Latest News', url: 'http://www.aljazeera.com/xml/rss/all.xml'}], host: 'aljazeera.com'},
                       { name: 'Pakistan Nation', retention: 7, maxitems: 400, uiorder: 41, rss: [{name: 'Latest News', url: 'http://nation.com.pk/feeds'}], host: 'nation.com.pk'},
                       { name: 'Indian Express', retention: 7, maxitems: 400, uiorder: 42, rss: [{name: 'Latest News', url: 'http://indianexpress.com/print/front-page/feed/'}], host: 'indianexpress.com'},
                       { name: 'News Biscuit', retention: 7, maxitems: 400, uiorder: 43, rss: [{name: 'Latest News', url: 'http://www.newsbiscuit.com/feed/'}], host: 'newsbiscuit.com'},
                       { name: 'The Economist', retention: 7, maxitems: 400, uiorder: 44, rss: [{name: 'Business and Finance', url: 'http://www.economist.com/sections/business-finance/rss.xml'}], host: 'economist.com'}
                     ]
    /* eslint-enable */
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
  require('./articlemuncher.js')
}
