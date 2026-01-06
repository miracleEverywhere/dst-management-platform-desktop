import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default function (app) {
  app.use(pinia)
}
