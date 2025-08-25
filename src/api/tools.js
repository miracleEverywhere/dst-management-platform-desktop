import http from "@/utils/axios.js";

export default {
  osInfo: {
    url: `/tools/os_info`,
    get: async function(data){
      return await http.get(this.url, data);
    }
  },
  install: {
    url: `/tools/install`,
    post: async function(data){
      return await http.post(this.url, data);
    }
  },
  installStatus: {
    url: `/tools/install/status`,
    get: async function(data){
      return await http.get(this.url, data);
    }
  },
  isInstalling: {
    url: `/tools/install/is_installing`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
  announce: {
    url: `/tools/announce`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function(data){
      return await http.post(this.url, data);
    },
    delete: async function(data){
      return await http.delete(this.url, data);
    },
    put: async function(data){
      return await http.put(this.url, data);
    },
  },
  update: {
    url: `/tools/update`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    put: async function(data){
      return await http.put(this.url, data);
    },
  },
  backup: {
    url: `/tools/backup`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function(data){
      return await http.post(this.url, data);
    },
    put: async function(data){
      return await http.put(this.url, data);
    },
    delete: async function(data){
      return await http.delete(this.url, data);
    },
  },
  backupRestore: {
    url: `/tools/backup/restore`,
    post: async function(data){
      return await http.post(this.url, data);
    },
  },
  backupImport: {
    url: `/tools/backup/import`,
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  // backupDownload: {
  //   url: `/tools/backup/download`,
  //   post: async function(data){
  //     return await http.post(this.url, data);
  //   },
  // },
  multiDelete: {
    url: `/tools/backup/multi`,
    delete: async function(data){
      return await http.delete(this.url, data);
    },
  },
  mod: {
    install: {
      all: {
        url: `/tools/mod/install/all`,
        post: async function(data){
          return await http.post(this.url, data);
        },
      }
    }
  },
  statistics: {
    url: `/tools/statistics`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
  keepalive: {
    url: `/tools/keepalive`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    put: async function(data){
      return await http.put(this.url, data);
    },
  },
  replaceSo: {
    url: `/tools/replace_so`,
    post: async function(data){
      return await http.post(this.url, data);
    },
  },
  token: {
    create: {
      url: `/tools/token`,
      post: async function(data){
        return await http.post(this.url, data);
      },
    }
  },
  metrics: {
    url: `/tools/metrics`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
}
