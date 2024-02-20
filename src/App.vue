<template>
    <div class="app app--vue">
        <div class="app__list">
            <ListHeader
            :loader="listLoader"
            @refreshList="refreshList()"
            >
                <template v-slot:gruped>
                    <div class="multiselect__wrap">
                        <Multiselect
                        v-if="groupByOptions"
                        class="multiselect--status"
                        placeholder="Grupuj po"
                        v-model="localGroupBy"
                        :options="groupByOptions"
                        :disabled="listLoader.isLoading || (listLoader && listLoader.hasOwnProperty('isLoading') && listLoader.isLoading)"
                        @change="handleChangeGroupBy"
                        />
                    </div>
                </template>

                <template v-slot:filters>
                    <div class="multiselect__wrap">
                        <Multiselect
                        v-if="filterYearsOptions"
                        class="multiselect--status"
                        placeholder="Wybierz rok"
                        v-model="localFilterYears"
                        :options="filterYearsOptions"
                        :disabled="listLoader.isLoading || (listLoader && listLoader.hasOwnProperty('isLoading') && listLoader.isLoading)"
                        @change="handleChangeFilterYears"
                        />
                    </div>
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

        <Statistics
        :loader="listLoader"
        :list="list"
        />
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import Statistics from '~/components/Statistics.vue'
import ListHeader from '~/components/Core/ListHeader.vue'
import CalcListTable from '~/components/Calc/CalcListTable.vue'

export default {
    components: {
        Statistics, ListHeader, CalcListTable
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

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
    font-size: 14px;
}
</style>
