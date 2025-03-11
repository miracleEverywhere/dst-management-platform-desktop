const {app, ipcMain, BrowserWindow, Menu, Tray, shell, dialog} = require('electron')
const {join} = require('path')
const fs = require('fs')
const Store = require('electron-store')


const store = new Store()
let win, winConfig, winDashboard, needShownWin
let tray

// 屏蔽安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
const template = [
    {
        label: '文件',
        submenu: [
            {
                label: "关闭",
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    app.isQuiting = true
                    app.quit()
                }
            },
        ]
    },
    {
        label: '视图',
        submenu: [
            {role: 'reload', label: "重新载入"},
            {type: 'separator'},
            { role: 'minimize', label: '最小化' },
        ]
    },
    {
        label: '帮助',
        submenu: [
            {
                label: '了解更多',
                click: async () => {
                    await shell.openExternal('https://electronjs.org')
                }
            },
            {
                label: '关于',
                click: () => {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '饥荒管理平台',
                        message: '饥荒管理平台',
                        detail: `版本: ${app.getVersion()}\n作者: Miracle\n开源协议: MIT`,
                        buttons: ['确定'],
                    });
                },
            },
        ]
    }
];

const createWinConfig = () => {
    winConfig = new BrowserWindow({
        width: 1090,
        height: 800,
        resizable: false,
        // icon: iconPath,
        autoHideMenuBar: true,
        title: '饥荒管理平台',
        show: false,
        webPreferences: {
            webSecurity: false,
            contextIsolation: true,
            nodeIntegration: false,
            preload: join(__dirname, 'preload.js'),
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        winConfig.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/config`)
        // winConfig.webContents.openDevTools({mode: 'detach'})
    } else {
        winConfig.loadFile(join(__dirname, '../dist/index.html'), {hash: '#/config'})
    }

    if (process.platform === 'darwin') {
        const menuConfig = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menuConfig);
    }

    winConfig.on('close', (event) => {
        if (!app.isQuiting) {
            // 如果不是通过退出菜单项触发的关闭事件，阻止关闭并隐藏窗口
            event.preventDefault();
            winConfig.hide();
        }
    });

    winConfig.on('closed', () => {
        winConfig = null;
    });

    winConfig.once('ready-to-show', () => {
        winConfig.show()
        needShownWin = winConfig
    })
}

const createWinDashboard = () => {
    winDashboard = new BrowserWindow({
        width: 1600,
        height: 900,
        resizable: true,
        // icon: iconPath,
        autoHideMenuBar: true,
        title: '饥荒管理平台',
        show: false,
        webPreferences: {
            webSecurity: false,
            contextIsolation: true,
            nodeIntegration: false,
            preload: join(__dirname, 'preload.js'),
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        winDashboard.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/dashboard`)
        winDashboard.webContents.openDevTools({mode: 'detach'})
    } else {
        winDashboard.loadFile(join(__dirname, '../dist/index.html'), {hash: '#/dashboard'})
    }

    if (process.platform === 'darwin') {
        const menuDashboard = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menuDashboard);
    }

    winDashboard.on('close', (event) => {
        if (!app.isQuiting) {
            // 如果不是通过退出菜单项触发的关闭事件，阻止关闭并隐藏窗口
            event.preventDefault();
            winDashboard.hide();
        }
    });

    winDashboard.on('closed', () => {
        winDashboard = null;
    });
}


const createTray = () => {
    let iconPath = '../public/favicon.ico'
    if (process.platform === 'darwin') {
        iconPath = '../public/iconTray@2x.png'
    }

    tray = new Tray(join(__dirname, iconPath));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出', click: () => {
                app.isQuiting = true
                app.quit()
            }
        },
    ]);

    tray.setToolTip('饥荒管理平台');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (needShownWin) needShownWin.show()
    })
}

app.setName('饥荒管理平台')

app.whenReady().then(() => {
    createTray()
    createWinConfig()
    createWinDashboard()
})

app.on('before-quit', () => {
    app.isQuiting = true; // 设置标志位
});

// MacOS专属
app.on('activate', () => {
    if (needShownWin) needShownWin.show()
});

ipcMain.on('open-dashboard-window', () => {
    needShownWin = winDashboard
    winConfig.hide()
    winDashboard.reload()
    winDashboard.webContents.on('did-finish-load', () => {
        winDashboard.show()
        winDashboard.focus()
    });
})

ipcMain.on('open-config-window', () => {
    needShownWin = winConfig
    winDashboard.hide()
    winConfig.reload()
    winConfig.webContents.on('did-finish-load', () => {
        winConfig.show()
        winConfig.focus()
    });
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
    if (win) win.webContents.openDevTools({mode: 'detach'})
})