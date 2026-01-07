## 饥荒管理平台App

![GitHub Release](https://img.shields.io/github/v/release/miracleEverywhere/dst-management-platform-desktop)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/miracleEverywhere/dst-management-platform-desktop/total)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/miracleEverywhere/dst-management-platform-desktop)
![GitHub License](https://img.shields.io/github/license/miracleEverywhere/dst-management-platform-desktop)
<div>
    <img src="public/dmp.svg" height="200" alt="DMP"/>
    <h3>:star2: 实现同时管理多个DMP的桌面软件 :star2:</h3>
</div>

### 注意

使用该软件前，需要先部署[饥荒管理平台](https://github.com/miracleEverywhere/dst-management-platform-api)

### MacOS 如果遇到 xxx 已损坏，解决方法：
打开终端，输入以下代码，需要输入开机密码
```shell
sudo spctl --master-disable
```
接下来打开**设置**-**隐私与安全性**-**允许以下来源的应用**，选择**任何来源**  
  
输入以下代码：
```shell
sudo xattr -rd com.apple.quarantine /Applications/饥荒管理平台.app
```
