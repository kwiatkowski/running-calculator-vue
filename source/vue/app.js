import { createApp } from 'vue'

// app components
import AppRunningCalculator from '~/components/AppRunningCalculator.vue'

// general setup
import store from '~/setup/setup-store'
import setupBasic from './setup/setup-basic'
import setupAxios from '~/setup/setup-axios'
import setupI18n from './setup/setup-i18n'

// app store
import StoreTodos from '~/store/Main/list.js'

// app register store module
store.registerModule('todos', StoreTodos)

const app = createApp(AppRunningCalculator)

app.use(store)
app.use(setupI18n)

setupBasic(app)
setupAxios(app)

app.mount('#app-running-calculator')
