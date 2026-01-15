import http from "@/utils/axios"

export default {
  backup: {
    url: `/tools/backup`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    post: async function (data) {
      return await http.post(this.url, data)
    },
    delete: async function (data) {
      return await http.delete(this.url, data)
    },
    restore: {
      url: `/tools/backup/restore`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
    download: {
      url: `/tools/backup/download`,
      download: async function (data, saveName) {
        return await http.download(this.url, data, saveName)
      },
    },
  },
  announce: {
    url: `/tools/announce`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    put: async function (data) {
      return await http.put(this.url, data)
    },
  },
  map: {
    url: `/tools/map`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  token: {
    url: `/tools/token`,
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  snapshot: {
    url: `/tools/snapshot`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    delete: async function (data) {
      return await http.delete(this.url, data)
    },
  },
}
