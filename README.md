### 如果遇到 xxx 已损坏，解决方法：
打开终端，输入以下代码，需要输入开机密码
```shell
sudo spctl --master-disable
```
接下来打开**设置**-**隐私与安全性**-**允许以下来源的应用**，选择**任何来源**  
  
输入以下代码：
```shell
sudo xattr -rd com.apple.quarantine /Applications/饥荒管理平台.app
```
