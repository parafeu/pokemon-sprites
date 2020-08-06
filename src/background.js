'use strict'

import electron from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import path from 'path'
import { writeFileSync } from 'fs'

import Config from 'electron-config'

const { app, protocol, BrowserWindow, ipcMain } = electron
const isDevelopment = process.env.NODE_ENV !== 'production'

const config = new Config();

let mainWin = null;
let settingsWin = null;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow(devPath, prodPath, addToOptions) {
  let winVar

  let opts = {
    frame: false,
    icon: path.join(__static, 'icon.png'),
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  }

  Object.assign(opts, addToOptions);

  winVar = new BrowserWindow(opts)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await winVar.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
    if (!process.env.IS_TEST) winVar.webContents.openDevTools()
  } else {
    winVar.loadURL(`app://./${prodPath}`)
  }

  winVar.on('closed', () => {
    winVar = null
  })

  return winVar
}

var subscribeWindow = null

ipcMain.on('vuex-subscribe', (event) => {
  console.log(["subscribed"]);
  subscribeWindow = event.sender;
})

ipcMain.on('vuex-mutation', (event, mutation) => {
  if (subscribeWindow) {
    subscribeWindow.send('vuex-mutation', mutation);
  }
})

ipcMain.on('vuex-change', (event, state) => {
  config.set('state', state)
})

ipcMain.on('open-settings', async (event) => {
  if (settingsWin === null) {
    settingsWin = await createWindow('settings', 'settings.html', {
      width: 800,
      useContentSize: true,
      frame: false,
      height: 650,
    });

    settingsWin.on('closed', () => {
      settingsWin = null
    })
  } else {
    settingsWin.show();
  }
})

ipcMain.on('main-close', (event) => {
  if (mainWin !== null) {
    if (settingsWin !== null) {
      settingsWin.destroy()
    }

    mainWin.destroy()
  }
})

ipcMain.on('main-minimize', (event) => {
  mainWin.minimize();
})

ipcMain.on('settings-close', (event) => {
  if (settingsWin !== null) {
    settingsWin.destroy()
  }
})

ipcMain.on('settings-minimize', (event) => {
  settingsWin.minimize();
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (mainWin === null) {
    Object.assign(opts, config.get('winBounds'))

    let opts = {
      width: 900,
      height: 1000,
      transparent: true,
    }

    mainWin = await createWindow('main', 'main.html', opts)

    mainWin.on('close', () => {
      config.set('winBounds', mainWin.getBounds())
    });

    mainWin.on('closed', () => {
      mainWin = null
    })
  }
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  if (!process.env.WEBPACK_DEV_SERVER_URL) {
    createProtocol('app')
  }
  let opts = {
    width: 900,
    height: 1000,
    transparent: true,
  }

  Object.assign(opts, config.get('winBounds'))

  mainWin = await createWindow('main', 'main.html', opts)

  mainWin.on('close', () => {
    config.set('winBounds', mainWin.getBounds())
  });

  mainWin.on('closed', () => {
    mainWin = null
  })
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
