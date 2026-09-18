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
  },

  // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
  getters: {},
})

// 对外暴露方法
export default globalStore
