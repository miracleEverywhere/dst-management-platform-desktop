const {app, ipcMain, BrowserWindow, Menu, Tray, shell, dialog, net} = require('electron')
const {join} = require('path')
const path = require('path')
const fs = require('fs')
const Store = require('electron-store')


const store = new Store()
let winEntry, winDashboard, needShownWin
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
    label: '编辑',
    submenu: [
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
    ],
  },
  {
    label: '视图',
    submenu: [
      {role: 'reload', label: "重新载入"},
      {type: 'separator'},
      {role: 'minimize', label: '最小化'},
    ]
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '了解更多',
        click: async () => {
          await shell.openExternal('https://github.com/miracleEverywhere/dst-management-platform-desktop')
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

const createWinEntry = () => {
  winEntry = new BrowserWindow({
    width: 1090,
    height: 800,
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
    winEntry.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/entry`)
    // winEntry.webContents.openDevTools({mode: 'detach'})
  } else {
    winEntry.loadFile(join(__dirname, '../dist/index.html'), {hash: '#/entry'})
  }

  const menuConfig = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menuConfig);

  winEntry.on('close', (event) => {
    if (!app.isQuiting) {
      // 如果不是通过退出菜单项触发的关闭事件，阻止关闭并隐藏窗口
      event.preventDefault();
      winEntry.hide();
    }
  });

  winEntry.on('closed', () => {
    winEntry = null;
  });

  winEntry.once('ready-to-show', () => {
    winEntry.show()
    needShownWin = winEntry
  })
}

const createWinDashboard = () => {
  winDashboard = new BrowserWindow({
    width: 1600,
    height: 1080,
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

  const menuConfig = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menuConfig);

  winDashboard.on('show', () => {
    if (process.env.VITE_DEV_SERVER_URL) {
      return
    }
    if (winDashboard && !winDashboard.isDestroyed()) {
      winDashboard.webContents.send('force-navigate', '/dashboard')
    }
  })

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
  if (process.platform === 'linux') {
    iconPath = '../public/iconTray@2x.png'
  }

  tray = new Tray(join(__dirname, iconPath));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "    重新载入    ",
      click: () => {
        if (needShownWin) needShownWin.reload()
      }
    },
    {
      label: "    打开",
      click: () => {
        if (needShownWin) needShownWin.show()
      }
    },
    {
      label: '    关于',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: '饥荒管理平台',
          message: '饥荒管理平台',
          detail: `版本: ${app.getVersion()}\n作者: Miracle\n开源协议: MIT`,

        });
      },
    },
    {type: 'separator'},
    {
      label: '    退出', click: () => {
        app.isQuiting = true
        app.quit()
      },

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
  createWinEntry()
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
  winEntry.hide()
  winDashboard.reload()
  winDashboard.webContents.on('did-finish-load', () => {
    winDashboard.show()
    winDashboard.focus()
  });
})

ipcMain.on('open-entry-window', () => {
  needShownWin = winEntry
  winDashboard.hide()
  winEntry.reload()
  winEntry.webContents.on('did-finish-load', () => {
    winEntry.show()
    winEntry.focus()
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
  if (needShownWin) needShownWin.webContents.openDevTools({mode: 'detach'})
})

ipcMain.on('reload-window', () => {
  if (needShownWin) needShownWin.reload()
})

ipcMain.handle('download-file', async (event, { url, fileName }) => {
  return new Promise((resolve, reject) => {
    const downloadsPath = app.getPath('downloads');

    // 处理文件名
    // const finalFileName = fileName || path.basename(url);
    // const filePath = path.join(downloadsPath, finalFileName);
    const filePath = fileName

    console.log(filePath)

    const request = net.request(url);
    let receivedBytes = 0;
    let totalBytes = 0;

    request.on('response', (response) => {
      totalBytes = parseInt(response.headers['content-length'], 10) || 0;
      const fileStream = fs.createWriteStream(filePath);

      // 发送进度更新
      const sendProgress = () => {
        needShownWin.setProgressBar(totalBytes > 0 ? (receivedBytes / totalBytes) : 0)
      };

      // 定时发送进度 (每秒最多4次)
      const progressInterval = setInterval(sendProgress, 250);

      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        fileStream.write(chunk);
      });

      response.on('end', () => {
        clearInterval(progressInterval);
        fileStream.end();
        needShownWin.setProgressBar(-1)
        resolve({ filePath, status: 'completed' });
      });

      response.on('error', (error) => {
        clearInterval(progressInterval);
        fileStream.end();
        reject({ error: error.message, status: 'failed' });
      });
    });

    request.on('error', (error) => {
      reject({ error: error.message, status: 'failed' });
    });

    request.end();
  });
})

ipcMain.handle('show-save-dialog', async (event, options) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: options.title || '保存文件',
    defaultPath: options.defaultPath,
    properties: ['createDirectory']
  });

  return { canceled, filePath };
})

