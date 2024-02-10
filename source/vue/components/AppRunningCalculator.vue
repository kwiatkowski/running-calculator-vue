<template>
    <div class="app--vue">
        <div class="list">
            <ListHeader
            :loader="listLoader"
            @refreshList="refreshList()"
            >
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
            localFilterYears: this.filterYears
        }
    },
    watch: {
        filterYears() {
            this.localFilterYears = this.filterYears
        }
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
        },
        onChangeYears(event) {
            this.$emit('change-years', event)
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
