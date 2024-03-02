import { createRouter, createWebHistory } from 'vue-router'

import List from '~/components/List/List.vue'
import Charts from '~/components/Charts/Charts.vue'
import PlanRun from '~/components/PlanRun/PlanRun.vue'

const routes = [
    {
        path: '/training/',
        component: List
    },
    {
        path: '/training/charts',
        component: Charts
    },
    {
        path: '/training/plan-run',
        component: PlanRun
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
