import { createRouter, createWebHistory } from 'vue-router'
import i18n from '~/setup/setup-i18n'

import List from '~/components/List/List.vue'
import Charts from '~/components/Charts/Charts.vue'
import PlanRun from '~/components/PlanRun/PlanRun.vue'
import Error404 from '~/components/Core/Error404.vue'

const routes = [
    {
        path: '/training/',
        name: 'list',
        component: List,
        meta: {
            title: i18n.global.t('router.list.title')
        }
    },
    {
        path: '/training/charts',
        name: 'charts',
        component: Charts,
        meta: {
            title: i18n.global.t('router.charts.title')
        }
    },
    {
        path: '/training/plan-run',
        name: 'plan-run',
        component: PlanRun,
        meta: {
            title: i18n.global.t('router.plan-run.title')
        }
    },
    {
        path: '/:catchAll(.*)',
        name: 'error-404',
        component: Error404,
        meta: {
            title: i18n.global.t('router.error-404.title')
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to) => {
    document.title = i18n.global.t('app.title_prefix') + ' | ' + to.meta.title
})

export default router
