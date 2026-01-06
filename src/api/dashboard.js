import http from "@/utils/axios"

export default {
  exec: {
    game: {
      url: `/dashboard/exec/game`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
  },
  info: {
    base: {
      url: `/dashboard/info/base`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
    sys: {
      url: `/dashboard/info/sys`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
  connectionCode: {
    url: `/dashboard/connection_code`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    put: async function (data) {
      return await http.put(this.url, data)
    },
  },
  check: {
    lobby: {
      url: `/dashboard/check/lobby`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
  },
}