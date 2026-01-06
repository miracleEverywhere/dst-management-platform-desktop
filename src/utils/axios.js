import axios from 'axios'
import { showSnackbar } from '@/utils/snackbar'
import { getToken } from "@/utils/tools"
import useUserStore from "@store/user"
import { ApiVersion } from "@/config"
import useGlobalStore from "@store/global.js"


// 创建一个 axios 实例
const instance = axios.create({
  baseURL: ApiVersion,
  timeout: 600000, // 请求超时时间
})

// 请求拦截器：在请求发送之前添加 token
instance.interceptors.request.use(
  config => {
    const token = getToken()

    // 如果 token 存在，将其添加到请求头中
    if (token) {
      config.headers['X-DMP-TOKEN'] = token
    }
    const globalStore = useGlobalStore()

    config.headers["X-I18n-Lang"] = globalStore.language

    return config
  },
  error => {
    // 请求错误处理
    return Promise.reject(error)
  },
)

// 响应拦截器：处理响应数据
instance.interceptors.response.use(
  async response => {
    // 1. 如果是文件下载（responseType 为 blob），直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    const status = Number(response.data.status ?? response.data.code)
    if (status === 200) {
      // 服务器连接状态，非后端返回的status 或者 code
      // 这里的后端可能是code OR status 和 message OR message需要看后端传递的是什么？
      // console.log("200状态", status);
      return response.data
    } else if (status === 420) {
      const userStore = useUserStore()

      showSnackbar(response.data.message || "服务器偷偷跑到火星去玩了", 'error')
      await userStore.clearStore()
      window.location.href = '/#/login'

      return Promise.reject(response.data)
    } else {
      showSnackbar(response.data.message || "服务器偷偷跑到火星去玩了", 'error')

      return Promise.reject(response.data.message || "服务器偷偷跑到火星去玩了") // 可以将异常信息延续到页面中处理，使用try{}catch(error){};
    }
  },
  error => {
    // 响应错误处理
    const status = Number(error?.response?.data?.status ?? error?.response?.data?.code ?? error?.response?.status ?? error?.data?.code)
    if (status === 420) {
      const userStore = useUserStore()

      showSnackbar(error?.response?.data?.message || error?.data?.message || "登录状态已失效", 'error')
      userStore.clearStore().finally(() => {
        if (window.location.hash !== '#/login') {
          window.location.href = '/#/login'
        }
      })
      
      return Promise.reject(error)
    }

    error.data = error.data || {}
    if (error.data.message) {
      showSnackbar(error.status + " " + error.data.message, 'error')
    } else {
      error.data.message = "连接到服务器失败"
      showSnackbar(error.data.message, 'error')
    }

    return Promise.reject(error) // 将错误返回给 try{} catch(){} 中进行捕获，就算不进行捕获，上方 res.data.status != 200也会抛出提示。
  },
)

// 封装常用的请求方法
const http = {
  get: (url, params) => instance.get(url, { params }),
  post: (url, data) => instance.post(url, data),
  put: (url, data) => instance.put(url, data),
  delete: (url, data) => instance.delete(url, {
    headers: { 'Content-Type': 'application/json' },
    data: data,
  }),
  download: async (url, params, filename) => {
    try {
      // 设置 responseType 为 blob
      const response = await instance.get(url, {
        params,
        responseType: 'blob',
      })

      // 创建 Blob 对象
      const blob = new Blob([response.data])

      // 创建下载链接
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = downloadUrl

      // 设置文件名
      if (filename) {
        link.download = filename
      } else {
        // 尝试从响应头获取文件名
        const contentDisposition = response.headers['content-disposition']
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename\*?=(?:utf-8'')?([^;]+)/i)
          if (filenameMatch && filenameMatch[1]) {
            link.download = decodeURIComponent(filenameMatch[1])
          }
        } else {
          // 如果没有文件名，使用默认文件名
          link.download = 'download'
        }
      }

      // 触发下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 释放 URL 对象
      window.URL.revokeObjectURL(downloadUrl)

      return response
    } catch (error) {
      console.error('下载文件失败:', error)
      throw error
    }
  },
}

export default http
