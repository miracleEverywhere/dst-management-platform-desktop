import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import directives from "@/directives";
import ganttastic from "@infectoone/vue-ganttastic";
import dayjs from "dayjs";
import 'dayjs/locale/zh';
import 'dayjs/locale/en';
// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@/styles/custom.css'

dayjs.locale('zh')

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

app.use(directives)
app.use(ganttastic)

// Mount vue app
app.mount('#app')
