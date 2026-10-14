// 定义全局主题配置小仓库[选择式Api写法]
import { defineStore } from "pinia"
import { PiniaPrefix } from "@/config/index"

// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
const globalStore = defineStore("global", {
  // 开启数据持久化
  persist: {
    // enabled: true, // true 表示开启持久化保存
    key: PiniaPrefix + "global", // 默认会以 store 的 id 作为 key
    storage: localStorage,
  },

  // 存储数据state
  state: () => {
    return {
      theme: '',
      language: '',
      room: {
        id: 0,
        gameName: '',
      },

      // 这里的roomBasic的内容和room没对上，是后端写接口时的疏忽
      // room中是id和gameName，roomBasic中是roomID和roomName，这两个没对上
      // 就先这样吧
      roomBasic: [],
      gameVersion: {
        server: 0,
        local: 0,
      },
      dmpVersion: {
        noTip: false, // 是否要提醒
        closeVersion: '', // 点击时的最新版本
      },

      // GitHub 最新 Release 缓存，避免频繁请求触发 GitHub 限流，60 per Hour
      latestRelease: {
        latestVersion: '', // 最新版本号，即 tag_name
        releaseInfo: [], // 版本更新内容
        updateTime: 0, // 上次请求成功的时间戳，用于判断缓存是否过期
        ok: false, // 上次请求是否成功
      },
      entry: {
        id: '',
        ip: '',
        port: '',
        token: '',
        protocol: 'http',
        inEntry: true,
      },
    }
  },
  actions: {
    deleteRoom(id) {
      if (this.room.id === id) {
        this.room.id = 0
      }
      const index = this.roomBasic.findIndex(item => item.roomID === id)
      if (index !== -1) {
        this.roomBasic.splice(index, 1)
      }
    },

    // 请求 GitHub 上的最新 Release 信息并写入缓存
    // 返回值表示本次请求是否成功，失败时保留上一次的缓存内容
    async fetchLatestRelease() {
      try {
        const response = await fetch(
            'https://api.github.com/repos/miracleEverywhere/dst-management-platform-api/releases/latest',
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
              },
            },
        )

        if (!response.ok) {
          this.latestRelease.ok = false
          this.latestRelease.updateTime = Date.now()

          return false
        }

        const release = await response.json()

        this.latestRelease.latestVersion = release.tag_name || ''
        this.latestRelease.releaseInfo = (release.body || '')
            .replace(/[#`*-]+/g, '')
            .split('\n')
        this.latestRelease.ok = true
        this.latestRelease.updateTime = Date.now()

        return true
      } catch {
        this.latestRelease.ok = false
        this.latestRelease.updateTime = Date.now()

        return false
      }
    },
  },

  // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
  getters: {},
})

// 对外暴露方法
export default globalStore
