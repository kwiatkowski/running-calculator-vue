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
    app.config.globalProperties.$formatDateTime = function(payload) {
        if (payload) {
            return this.$moment(payload).format('YYYY-MM-DD HH:mm')
        } else {
            return null
        }
    }
    app.config.globalProperties.$daysDiffFromToday = function(payload) {
        if (payload) {
            const dueDate = this.$moment(payload, "YYYY-MM-DD HH:mm")
            const currentDate = this.$moment()
            const daysDiff = dueDate.diff(currentDate, 'days')

            if (daysDiff < 0 ) {
                return 0
            } else {
                return daysDiff
            }
        } else {
            return null
        }
    }
    app.config.globalProperties.$displayTypeIcon = function(payload) {
        if (payload) {
            const lowerCaseType = payload.toLowerCase()

            switch (lowerCaseType) {
                case 'idea':
                    return 'badge-icon-type--idea icon-lightbulb'
                case 'bug':
                    return 'badge-icon-type--bug icon-bug'
                default:
                    return 'badge-icon-type--task icon-ok'
            }
        } else {
            return null
        }
    }
    // app.use(Vuelidate)
    app.component('Multiselect', Multiselect)

    app.use(LoaderDirective)
}
