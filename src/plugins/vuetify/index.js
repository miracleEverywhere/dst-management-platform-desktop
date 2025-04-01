import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import { themes } from './theme'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { VTreeview } from 'vuetify/labs/VTreeview'

import { pl, zhHans } from 'vuetify/locale'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default function (app) {
  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    defaults,
    icons,
    components: {
      VFileUpload,
      VTreeview,
    },
    theme: {
      defaultTheme: 'light',
      themes,
    },
    locale: {
      locale: 'zhHans',
      fallback: 'sv',
      messages: { zhHans, pl },
    },
  })

  app.use(vuetify)
}
