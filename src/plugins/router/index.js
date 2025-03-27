import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
})

if (window.electronAPI) {
  window.electronAPI.onNavigate((path) => {
    router.push(path).catch(() => {})
  })
}

export default function (app) {
  app.use(router)
}
export { router }
