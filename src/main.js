import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'
import router from './router'
import store from './store'
import './directives'
import './vuetify'
import '@/utils/Filters'
import { createProvider } from './vue-apollo'
import Eagle from 'eagle.js'
import VueAnalytics from 'vue-analytics'
import * as Sentry from '@sentry/browser'
import FullCalendar from 'vue-full-calendar'
import VueCookies from 'vue-cookies'
import bowser from 'bowser'

import '@/assets/css/styles.styl'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'fullcalendar/dist/fullcalendar.css'

window.$store = store
window.$cookies = VueCookies

try {
  const mf = require('./build.info.json')
  window.$version = mf.buildTime
} catch (err) {
  console.warn('Failed to load build.info.json', err)
}

VueCookies.config('3d')

Vue.use(vue => (vue.$version = window.$version))
Vue.use(VueCookies)
Vue.use(FullCalendar)
Vue.use(Eagle)

Vue.config.productionTip = false
if (process.env.VUE_APP_GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.VUE_APP_GOOGLE_ANALYTICS,
    router
  })
}

if (process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  })
}

Vue.prototype.$moment = moment
Vue.prototype.$sentry = Sentry

const isSupportedBrowser = () => {
  const browser = bowser.getParser(window.navigator.userAgent)
  return browser.satisfies({
    android: {
      chrome: '>62',
      firefox: '>56'
    },
    iOS: {
      safari: '>11'
    },
    desktop: {
      chrome: '>62',
      firefox: '>56',
      safari: '>11'
    }
  })
}

let details = {}
let os = {}
let invalidMessage = ''
try {
  const browser = bowser.getParser(window.navigator.userAgent)
  details = browser.parsedResult.browser
  os = browser.parsedResult.os.name

  if (!isSupportedBrowser()) {
    invalidMessage = 'You are using an unsupported browser. Please download the latest version of Chrome, Firefox, or Safari'
    if (os === 'iOS') {
      invalidMessage = 'You are using an unsupported browser. Please use the latest version of Safari'
    }
  }
} catch (err) {
  // warn and set browser to something safe?
}

Vue.prototype.$browser = {
  details,
  invalidMessage,
  supported: isSupportedBrowser()
}

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
