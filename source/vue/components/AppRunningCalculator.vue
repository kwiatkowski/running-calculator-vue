<template>
    <div class="app--vue">
        <div class="list">
            <CalcListHeader
            :loader="listLoader"
            :filterByYears="filterYears"
            :filterByYearsOptions="filterYearsOptions"
            @changeYears="handleChangeFilterYears($event)"
            @refreshList="refreshList()"
            />

            <CalcListTable
            :loader="listLoader"
            :columns="listColumns"
            :data="list"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import CalcListHeader from '~/components/Calc/CalcListHeader.vue'
import CalcListTable from '~/components/Calc/CalcListTable.vue'

export default {
    components: {
        CalcListHeader, CalcListTable
    },
    computed: {
        ...mapState('calc', [
            'listLoader', 'list', 'listColumns', 'filterYears', 'filterYearsOptions'
        ])
    },
    methods: {
        ...mapMutations('calc', [
            'filterListByYear'
        ]),
        ...mapActions('calc', [
            'getListCalc'
        ]),
        init() {
            this.getListCalc({})
                .finally(() => {
                    let filter = this.getLocalStorageFilter()

                    if (filter && 'filterByYear' in filter) {
                        this.handleChangeFilterYears(filter.filterByYear)
                    }
                })
        },
        refreshList() {
            this.init()
        },
        handleChangeFilterYears(payload) {
            this.setLocalStorageFilter(payload)
            this.filterListByYear(payload)
        },
        setLocalStorageFilter(payload) {
            localStorage.setItem('trening/list', JSON.stringify({ filterByYear: payload }))
        },
        getLocalStorageFilter() {
            if (localStorage.getItem('trening/list')) {
                try {
                    return JSON.parse(localStorage.getItem('trening/list'))
                } catch (e) {
                    return
                }
            }
        }
    },
    mounted() {
        this.init()
    },
    // created() {
    //     this.$eventBus.$on('todo-refresh-list', this.refreshList)
    // },
    // beforeUnmount() {
    //     this.$eventBus.$off('todo-refresh-list', this.refreshList)
    // }
}
</script>
