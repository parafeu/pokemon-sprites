import { app, BrowserWindow, ipcMain } from 'electron'
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

const Config = require('electron-config')
const config = new Config();

function createWindow() {
  /**
   * Initial window options
   */
  let opts = {
    height: 900,
    useContentSize: true,
    transparent: true,
    frame: false,
    width: 1000
  }

  Object.assign(opts, config.get('winBounds'));

  mainWindow = new BrowserWindow(opts)

  mainWindow.loadURL(winURL)

  mainWindow.on('close', () => {
    config.set('winBounds', mainWindow.getBounds())
  });

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

var subscribeWindow = null

ipcMain.on('vuex-subscribe', (event) => {
  console.log(["subscribed"]);
  subscribeWindow = event.sender;
})

ipcMain.on('vuex-mutation', (event, mutation) => {
  if(subscribeWindow) {
    subscribeWindow.send('vuex-mutation', mutation);
  }
})

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
