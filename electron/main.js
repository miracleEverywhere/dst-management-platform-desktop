const { app, ipcMain, BrowserWindow } = require('electron')
const { join } = require('path')
const fs = require('fs')


let win

// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
const createWindow = (main) => {
    let width
    let height
    if (main) {
        width = 1600
        height = 900
    } else {
        width = 800
        height = 600
    }
    win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            contextIsolation: true, // 启用上下文隔离
            nodeIntegration: false, // 禁用 Node.js 集成
            preload: join(__dirname, './preload.js'), // 指定 preload.js 的路径
        },
    })

    if(process.env.process.env.VITE_DEV_SERVER_URL) {
        if (main) {
            win.loadURL(`${process.env.VITE_DEV_SERVER_URL}/dashboard`)
        } else {
            win.loadURL(`${process.env.VITE_DEV_SERVER_URL}`)
        }

        // 开启调试台
        win.webContents.openDevTools({mode:'detach'})
    }else {
        if (main) {
            win.loadFile(join(__dirname, '../dist/index.html'), { hash: 'main' })
        } else {
            win.loadFile(join(__dirname, '../dist/index.html'))
        }

    }
}

// Electron 会在初始化后并准备
app.whenReady().then(() => {
    createWindow(false)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('open-main-window', () => {
    if (win) {
        win.close()
    }
    createWindow(true)
});

ipcMain.on('open-config-window', () => {
    if (win) {
        win.close()
    }
    createWindow(false)
});

ipcMain.handle('read-file', async (event, filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });
    });
});