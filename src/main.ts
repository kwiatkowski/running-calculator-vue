import { createApp } from "vue"
import App from "~/App.vue"

import * as filters from '~/filters/filters'

// general setup
import store from '~/setup/setup-store'
import setupBasic from './setup/setup-basic'
import setupAxios from '~/setup/setup-axios'
import setupI18n from './setup/setup-i18n'

// app store
import StoreTraining from '~/store/Training/training.js'

// app register store module
store.registerModule('training', StoreTraining)

const app = createApp(App)

Object.keys(filters).forEach(key => {
    app.config.globalProperties.$filters = {
        ...(app.config.globalProperties.$filters || {}),
        [key]: filters[key],
    }
})

app.use(store)
app.use(setupI18n)

setupBasic(app)
setupAxios(app)

app.mount("#app")
