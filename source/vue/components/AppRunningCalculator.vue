<template>
    <div class="app--vue">
        <div class="list">
            <ListHeader
            :loader="listLoader"
            @refreshList="refreshList()"
            >
                <template v-slot:gruped>
                    <Multiselect
                    v-if="groupByOptions"
                    class="multiselect--status"
                    placeholder="Grupuj po"
                    v-model="localGroupBy"
                    :options="groupByOptions"
                    :disabled="listLoader.isLoading || (listLoader && listLoader.hasOwnProperty('isLoading') && listLoader.isLoading)"
                    @change="handleChangeGroupBy"
                    />
                </template>

                <template v-slot:filters>
                    <Multiselect
                    v-if="filterYearsOptions"
                    class="multiselect--status"
                    placeholder="Wybierz rok"
                    v-model="localFilterYears"
                    :options="filterYearsOptions"
                    :disabled="listLoader.isLoading || (listLoader && listLoader.hasOwnProperty('isLoading') && listLoader.isLoading)"
                    @change="handleChangeFilterYears"
                    />
                </template>
            </ListHeader>

            <CalcListTable
            :loader="listLoader"
            :columns="listColumns"
            :data="list"
            :filterYears="localFilterYears"
            :groupBy="localGroupBy"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import ListHeader from '~/components/Core/ListHeader.vue'
import CalcListTable from '~/components/Calc/CalcListTable.vue'

export default {
    components: {
        ListHeader, CalcListTable
    },
    data() {
        return {
            localFilterYears: this.filterYears,
            localGroupBy: this.groupBy,
        }
    },
    watch: {
        filterYears(payload) {
            this.localFilterYears = payload
        },
        groupBy(payload) {
            this.localGroupBy = payload
        }
    },
    computed: {
        ...mapState('calc', [
            'listLoader', 'list', 'listColumns', 'filterYears', 'filterYearsOptions', 'groupBy', 'groupByOptions'
        ])
    },
    methods: {
        ...mapMutations('calc', [
            'setListFilterByYear', 'setListGroupBy'
        ]),
        ...mapActions('calc', [
            'getListCalc'
        ]),
        init() {
            this.getListCalc({})
                .finally(() => {
                    if (this.getLocalStorageFilter()) {
                        this.handleChangeFilterYears(this.getLocalStorageFilter())
                    }

                    if (this.getLocalStorageGroupBy()) {
                        this.handleChangeGroupBy(this.getLocalStorageGroupBy())
                    }
                })
        },
        refreshList() {
            this.init()
        },
        handleChangeFilterYears(payload) {
            this.setLocalStorageFilter(payload)
            this.setListFilterByYear(payload)
        },
        handleChangeGroupBy(payload) {
            this.setLocalStorageGroupBy(payload)
            this.setListGroupBy(payload)
        },
        setLocalStorageFilter(payload) {
            localStorage.setItem('trening/filter', payload)
        },
        getLocalStorageFilter() {
            if (localStorage.getItem('trening/filter')) {
                return parseInt(localStorage.getItem('trening/filter'))
            } else {
                return null
            }
        },
        setLocalStorageGroupBy(payload) {
            localStorage.setItem('trening/groupBy', payload)
        },
        getLocalStorageGroupBy() {
            if (localStorage.getItem('trening/groupBy')) {
                return localStorage.getItem('trening/groupBy')
            } else {
                return null
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
