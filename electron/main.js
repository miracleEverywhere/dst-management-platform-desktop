const { app, ipcMain, BrowserWindow, Menu, Tray } = require('electron')
const { join } = require('path')
const fs = require('fs')
const Store = require('electron-store')


const store = new Store()
let win, tray

// 屏蔽安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const createWindow = (main) => {
    let width, height
    if (main) {
        width = 1600
        height = 900
    } else {
        width = 1090
        height = 800
    }
    win = new BrowserWindow({
        width: width,
        height: height,
        resizable: main,
        // icon: iconPath,
        autoHideMenuBar: true,
        title: '饥荒管理平台',
        webPreferences: {
            webSecurity: false,
            contextIsolation: true,
            nodeIntegration: false,
            preload: join(__dirname, 'preload.js'),
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        console.log(process.env.VITE_DEV_SERVER_URL)
        win.loadURL(`${process.env.VITE_DEV_SERVER_URL}${main ? '#/dashboard' : '#/config'}`)
        win.webContents.openDevTools({ mode: 'detach' })
    } else {
        win.loadFile(join(__dirname, '../dist/index.html'), {hash: main ? '#/dashboard' : '#/config'})
    }

    const template = [
        {
            label: '文件',
            submenu: [
                { role: 'quit', label: "关闭"},
            ]
        },
        {
            label: '视图',
            submenu: [
                { role: 'reload', label: "重新载入" },
                { type: 'separator' },
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    let iconPath = '../public/icon.png'
    tray = new Tray(join(__dirname, iconPath));

    const contextMenu = Menu.buildFromTemplate([
        { label: '打开', click: () => { console.log('打开应用'); } },
        { label: '退出', role: 'quit' }
    ]);

    tray.setToolTip('我的应用');
    tray.setContextMenu(contextMenu);
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

ipcMain.on('open-dev-tool', () => {
    if (win) win.webContents.openDevTools({ mode: 'detach' })
})