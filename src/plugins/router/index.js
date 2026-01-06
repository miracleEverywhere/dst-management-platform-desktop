import { createRouter, createWebHashHistory } from 'vue-router'
import {createDynamicRouter, staticRouter} from './routes'
import useUserStore from "@store/user"
import nprogress from "@/utils/nprogress"


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRouter,
})

if (window.electronAPI) {
  window.electronAPI.onNavigate((path) => {
    router.push(path).catch(() => {})
  })
}

let dynamicRoutesAdded = false
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const hasToken = !!userStore.token

  nprogress.start()
  if (!dynamicRoutesAdded) {
    await createDynamicRouter(router, userStore.menus)
    dynamicRoutesAdded = true
  }

  next()
})

router.onError(error => {
  // 结束全屏动画
  nprogress.done()
  console.warn("路由错误", error.message)
})

router.afterEach((to, from) => {
  // console.log("后置守卫", to, from);
  // 结束全屏动画
  nprogress.done()
})

export default function (app) {
  app.use(router)
}
export { router }
