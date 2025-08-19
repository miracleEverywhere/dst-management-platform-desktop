const {app, ipcMain, BrowserWindow, Menu, Tray, shell, dialog, net} = require('electron')
const {join} = require('path')
const path = require('path')
const fs = require('fs')
const Store = require('electron-store')


const store = new Store()
let winConfig, winDashboard, needShownWin
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

  const menuConfig = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menuConfig);

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
    height: 1080,
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
  if (needShownWin) needShownWin.webContents.openDevTools({mode: 'detach'})
})

ipcMain.on('reload-window', () => {
  if (needShownWin) needShownWin.reload()
})

ipcMain.handle('download-file', async (event, { url, fileName }) => {
  return new Promise((resolve, reject) => {
    const downloadsPath = app.getPath('downloads');

    // 处理文件名
    const finalFileName = fileName || path.basename(url);
    const filePath = path.join(downloadsPath, finalFileName);

    const request = net.request(url);
    let receivedBytes = 0;
    let totalBytes = 0;

    request.on('response', (response) => {
      totalBytes = parseInt(response.headers['content-length'], 10) || 0;
      const fileStream = fs.createWriteStream(filePath);

      // 发送进度更新
      const sendProgress = () => {
        event.sender.send('download-progress', {
          receivedBytes,
          totalBytes,
          progress: totalBytes > 0 ? (receivedBytes / totalBytes) : 0
        });
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

