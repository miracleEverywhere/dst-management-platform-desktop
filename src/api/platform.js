import http from "@/utils/axios"

export default {
  overview: {
    url: `/platform/overview`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  gameVersion: {
    url: `/platform/game_version`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  osInfo: {
    url: `/platform/os_info`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  metrics: {
    url: `/platform/metrics`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  globalSettings: {
    url: `/platform/global_settings`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  runningScreens: {
    url: `/platform/running_screens`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  screen: {
    running: {
      url: `/platform/screen/running`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
    kill: {
      url: `/platform/screen/kill`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
  },
}