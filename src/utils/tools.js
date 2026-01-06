import { PiniaPrefix } from "@/config/index"
import CryptoJS from 'crypto-js'
import luaparse from "luaparse"
import { v4 as uuidv4 } from 'uuid'

export function getBrowserLang() {
  // 获取浏览器语言，默认回退到 'zh'（中文）
  let browserLang = navigator.language ? navigator.language : "zh"
  let defaultBrowserLang = "zh" // 默认语言

  // 转换为小写以便比较
  browserLang = browserLang.toLowerCase()

  switch (browserLang) {
  // 简体中文（中国大陆）
  case "zh":
  case "zh-cn":
  case "zh-hans":
  case "zh-sg":

    // 繁体中文（台湾、香港）
  case "zh-tw":
  case "zh-hk":
  case "zh-mo":
    defaultBrowserLang = "zh"
    break

    // 英文（美国、英国等）
  case "en":
  case "en-us":
  case "en-gb":
  case "en-au":
  case "en-ca":
    defaultBrowserLang = "en"
    break

    //   // 日语
    // case "ja":
    // case "ja-jp":
    //   defaultBrowserLang = "ja"
    //   break
    //
    //   // 韩语
    // case "ko":
    // case "ko-kr":
    //   defaultBrowserLang = "ko"
    //   break
    //
    //   // 法语
    // case "fr":
    // case "fr-fr":
    // case "fr-ca":
    //   defaultBrowserLang = "fr"
    //   break
    //
    //   // 德语
    // case "de":
    // case "de-de":
    // case "de-at":
    // case "de-ch":
    //   defaultBrowserLang = "de"
    //   break
    //
    //   // 西班牙语
    // case "es":
    // case "es-es":
    // case "es-mx":
    // case "es-ar":
    //   defaultBrowserLang = "es"
    //   break
    //
    //   // 其他语言...
    // case "ru":
    // case "ru-ru":
    //   defaultBrowserLang = "ru"
    //   break
    //
    // case "pt":
    // case "pt-br":
    // case "pt-pt":
    //   defaultBrowserLang = "pt"
    //   break
    //
    // case "it":
    // case "it-it":
    //   defaultBrowserLang = "it"
    //   break

    // 如果未匹配到，默认返回 'zh'
  default:
    defaultBrowserLang = "zh"
  }

  return defaultBrowserLang
}

export const getEditorLang = lang => {
  switch (lang) {
  case "zh":
    return 'zh-CN'
  case "en":
    return 'en-US'
  default:
    return 'zh-CN'
  }
}

export const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const validateIpv4 = ip => {
  const ipv4Pattern =
        /^(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})$/

  if (ipv4Pattern.test(ip)) {
    return true
  } else {
    return false
  }
}

export const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + "..."
  } else {
    return str
  }
}

export const formatBytes = bytes => {
  if (bytes === 0) return "0 B"

  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function seconds2Time(totalSeconds) {
  const years = Math.floor(totalSeconds / (365 * 24 * 60 * 60))

  totalSeconds %= 365 * 24 * 60 * 60

  const days = Math.floor(totalSeconds / (24 * 60 * 60))

  totalSeconds %= 24 * 60 * 60

  const hours = Math.floor(totalSeconds / (60 * 60))

  totalSeconds %= 60 * 60

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const timeParts = []

  if (years > 0) timeParts.push(`${years}年`)
  if (days > 0) timeParts.push(`${days}天`)
  if (hours > 0) timeParts.push(`${hours}时`)
  if (minutes > 0) timeParts.push(`${minutes}分`)
  if (seconds > 0) timeParts.push(`${seconds}秒`)

  return timeParts.length > 0 ? timeParts.join(" ") : "0秒"
}

export const timestamp2time = timestamp => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const day = ("0" + date.getDate()).slice(-2)
  const hours = ("0" + date.getHours()).slice(-2)
  const minutes = ("0" + date.getMinutes()).slice(-2)
  const seconds = ("0" + date.getSeconds()).slice(-2)
  
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  )
}

export const timestamp2timeWithoutDate = timestamp => {
  const date = new Date(timestamp)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const seconds = ('0' + date.getSeconds()).slice(-2)
  
  return hours + ':' + minutes + ':' + seconds
}

export const deepCopy = (target, myMap = new WeakMap()) => {
  //1. 保证传入的target为引用类型
  if (typeof target !== "object" || target === null) {
    return target
  }

  //6. 判断当前对象是否被拷贝过
  if(myMap.get(target)) {
    return myMap.get(target)
  }

  //7. 判断是否Date或者RegExp，这里面还有很多判断没有写出比如String，Number等
  if (target instanceof Date) return new Date(target)
  if (target instanceof RegExp) return new RegExp(target)

  //2. 判断传入的target是对象还是数组，在创建新的copyTarget
  const copyTarget = Array.isArray(target) ? [] : {}


  //3. 将它的拷贝的对象保存到myMap，也就是哈希表
  myMap.set(target, copyTarget)
  for (let item in target) {
    //4. 是自身的而不是原型链上的
    if (target.hasOwnProperty(item)) {
      //5.进行下一次递归，不是引用类型会直接返回
      copyTarget[item] = deepCopy(target[item], myMap)
    }
  }
  
  return copyTarget
}

export const getToken = () => {
  const auth = window.localStorage.getItem(PiniaPrefix + "user")
  if (auth != null && auth !== "" && auth !== undefined) {
    const parseAuth = JSON.parse(auth)
    const keys = Object.keys(parseAuth)
    if (keys.includes("token")) {
      return parseAuth.token
    } else {
      return ""
    }
  } else {
    return ""
  }
}

export const SHA512 = data => {
  return CryptoJS.SHA512(data).toString()
}

export const debounce = (fn, delay) => {
  let timer
  
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

export const generateRandomString = length => {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz'

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)

    result += characters.charAt(randomIndex)
  }

  return result
}

export const parseModLua = modLua => {
  if (modLua === '') {
    return []
  }

  try {
    // ['workshop-xxx', 'workshop-xxx'...]
    const data = []
    const ast = luaparse.parse(modLua)
    const fields = ast.body[0].arguments[0].fields
    for (let item of fields) {
      const key = item.key
      if (key.type === 'StringLiteral') {
        let mod = key.raw.replace(/\\/g, '').replace(/'/g, '').replace(/"/g, '')
        data.push(mod)
      }
    }
    
    return data
  } catch {
    return []
  }
}

export const getDstToken = () => {
  let decoded = "VjFSQ2ExVXlWbkpsUm1oaFVqRmFWVlJXV21GaVZsWnlZVWRHV0dKV1JqUldNakI0V1ZaS1YyTkhlRlpOVjFKeVZrUkJOVkpzY0VkYVJtaFVVakpSZVZac1dsTlNNazE0VW14a1VtSlZXbWhVVlZKelUyeHJlRlZyT1ZaaVJscEpWMnRTUzFac1NYbFVXSEJhWld0YWRsa3haRWRYVms1VlZHeGtWMDFZUWtoV01qRjNZbTFXV0Zac1dtcFNSVXB2V2xkd1FrOVJQVDA9"
  const times = 5

  for (let i = 0; i < times; i++) {
    decoded = atob(decoded)
  }

  return decoded
}

export const generateUUID = () => {
  return uuidv4()
}

export const getDstRoleName = (name, lang) => {
  const RoleMap = {
    "zh": {
      "wilson": "威尔逊",
      "willow": "薇洛",
      "wolfgang": "沃尔夫冈",
      "wendy": "温蒂",
      "wx78": "WX-78",
      "wickerbottom": "薇克巴顿",
      "woodie": "伍迪",
      "wes": "韦斯",
      "waxwell": "麦斯威尔",
      "wathgrithr": "薇格弗德",
      "webber": "韦伯",
      "winona": "薇诺娜",
      "warly": "沃利",
      "walter": "沃尔特",
      "wortox": "沃拓克斯",
      "wormwood": "沃姆伍德",
      "wurt": "沃特",
      "wanda": "旺达",
      "wonkey": "芜猴",
    },
    "en": {
      "wilson": "Wilson",
      "willow": "Willow",
      "wolfgang": "Wolfgang",
      "wendy": "Wendy",
      "wx78": "WX-78",
      "wickerbottom": "Wickerbottom",
      "woodie": "Woodie",
      "wes": "Wes",
      "waxwell": "Waxwell",
      "wathgrithr": "Wathgrithr",
      "webber": "Webber",
      "winona": "Winona",
      "warly": "Warly",
      "walter": "Walter",
      "wortox": "Wortox",
      "wormwood": "Wormwood",
      "wurt": "Wurt",
      "wanda": "Wanda",
      "wonkey": "Wonkey",
    },
  }

  const translations = RoleMap[lang]

  if (!translations) return name

  return translations[name] ?? name
}

export function parseJwt(token) {
  try {
    // 分割 JWT 的三个部分
    const [headerBase64, payloadBase64, signature] = token.split('.');

    // Base64 解码（注意处理 URL 安全的 Base64）
    const header = JSON.parse(atob(headerBase64.replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));

    return {
      header,
      payload,
      signature
    };
  } catch (e) {
    return null;
  }
}