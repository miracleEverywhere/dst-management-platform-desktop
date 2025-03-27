// 定义全局主题配置小仓库[选择式Api写法]
import {defineStore} from "pinia";
import {PINIA_PREFIX} from "@/config/index.js"

// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
const configStore = defineStore("config", {
  // 开启数据持久化
  persist: {
    // enabled: true, // true 表示开启持久化保存
    key: PINIA_PREFIX + "config", // 默认会以 store 的 id 作为 key
    storage: localStorage
  },
  // 存储数据state
  state: () => {
    return {
      inConfig: undefined,
      url: '',
      token: '',
    };
  },
  actions: {

  },
  // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
  getters: {}
});

// 对外暴露方法
export default configStore;
