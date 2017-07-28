'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

/** Application Globals */
global.appFolders = {
  main: path.join(app.getPath('appData'), 'com.gokatana.nano'),
  data: path.join(app.getPath('appData'), 'com.gokatana.nano', 'data'),
  config: path.join(app.getPath('appData'), 'com.gokatana.nano', 'config'),
  cache: path.join(app.getPath('appData'), 'com.gokatana.nano', 'cache'),
  tmp: path.join(app.getPath('appData'), 'com.gokatana.nano', 'tmp'),
  archive: path.join(app.getPath('appData'), 'com.gokatana.nano', 'archive')
}

global.BUSY_FETCHINGARTICLES = false
global.BUSY_COMPACTING = false
global.ONLINE_STATUS = 'online'
global.feeds = []

ipcMain.on('FEEDS_STORE_IN_MAIN', function (event, feeds) {
  global.feeds = feeds
})

ipcMain.on('ONLINE_STATUS_CHANGED', function (event, status) {
  global.ONLINE_STATUS = status
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      webSecurity: false
    }
  })

  let contents = mainWindow.webContents
  ipcMain.on('startup_application', function (event, arg) {
    contents.send('startup_application_message', 'Startup sequence launched')
    require('./startup.js')
  })

  require('./webrequest.js')

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
