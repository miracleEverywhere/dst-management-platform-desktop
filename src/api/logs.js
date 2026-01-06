import http from "@/utils/axios"

export default {
  content: {
    url: `/logs/content`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  history: {
    list: {
      url: `/logs/history/list`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
    content: {
      url: `/logs/history/content`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
  clean: {
    url: `/logs/clean`,
    delete: async function (data) {
      return await http.delete(this.url, data)
    },
    info: {
      url: `/logs/clean/info`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
  download: {
    url: `/logs/download`,
    download: async function (data, saveName) {
      return await http.download(this.url, data, saveName)
    },
  },
}
