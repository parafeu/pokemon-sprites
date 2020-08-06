import electron from 'electron'
import Config from 'electron-config'
import { readFileSync } from 'fs';

const config = new Config();

const { ipcRenderer, remote } = electron
window.ipcRenderer = ipcRenderer
window.remote = remote

window.readFileSync = readFileSync;

const state = config.get('state');
window.state = state