const { app, ipcMain, BrowserWindow } = require('electron')
const { join } = require('path')
const fs = require('fs')
const Store = require('electron-store')


const store = new Store()
let win


// 屏蔽安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const createWindow = (main) => {
    let width, height
    if (main) {
        width = 1600
        height = 900
    } else {
        width = 1090
        height = 768
    }
    win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            webSecurity: false,
            contextIsolation: true,
            nodeIntegration: false,
            preload: join(__dirname, 'preload.js'),
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(`${process.env.VITE_DEV_SERVER_URL}${main ? 'dashboard' : 'config'}`)
        win.webContents.openDevTools({ mode: 'detach' })
    } else {
        win.loadFile(join(__dirname, '../dist/index.html'), { hash: main ? 'main' : '' })
    }
}

app.whenReady().then(() => {
    createWindow(false)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('open-dashboard-window', () => {
    if (win) win.close()
    createWindow(true)
})

ipcMain.on('open-config-window', () => {
    if (win) win.close()
    createWindow(false)
})

ipcMain.handle('read-file', async (event, filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
})

ipcMain.on('setStore', (_, key, value) => {
    store.set(key, value)
})

ipcMain.on('getStore', (event, key) => {
    event.returnValue = store.get(key) || ''
})

ipcMain.on('deleteStore', (event, key) => {
    event.returnValue = store.delete(key) || ''
})

ipcMain.on('clearStore', (event) => {
    event.returnValue = store.clear() || ''
})