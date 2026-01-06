import http from "@/utils/axios"

export default {
  online: {
    url: `/player/online`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  list: {
    url: `/player/list`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  uidmap: {
    url: `/player/uidmap`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  statistics: {
    onlineTime: {
      url: `/player/statistics/online_time`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
    playerCount: {
      url: `/player/statistics/player_count`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
}
