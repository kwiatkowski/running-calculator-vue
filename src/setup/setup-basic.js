// setup-basic.js
import moment from 'moment'

import * as Vue from 'vue'
import VueEventer from 'vue-eventer'
import Multiselect from '@vueform/multiselect'
// import Vuelidate from 'vuelidate'

// custom directives
import LoaderDirective from '~/directives/loader.directive'


export default function setupBasic(app) {
    app.config.globalProperties.$moment = moment
    app.config.globalProperties.$eventBus = new VueEventer()
    app.config.globalProperties.$formatDate = function(payload) {
        if (payload) {
            return this.$moment(payload).format('YYYY.MM.DD')
        } else {
            return null
        }
    }
    // app.use(Vuelidate)
    app.component('Multiselect', Multiselect)

    app.use(LoaderDirective)
}
