<template>
    <ListHeader
    :loader="listLoader"
    @refreshList="refreshList()"
    >
        <template v-slot:gruped>
            <div class="list__header-grouping">
                <Multiselect
                v-if="groupByOptions"
                class="multiselect--inline multiselect--pad-left"
                :placeholder="$t('calc.list.group_by.placeholder')"
                v-model="localGroupBy"
                :options="groupByOptions"
                :disabled="listLoader.isLoading || (listLoader && listLoader.hasOwnProperty('isLoading') && listLoader.isLoading)"
                @change="handleChangeGroupBy"
                >
                    <template v-slot:singlelabel="{ value }">
                        <div class="multiselect-single-label">
                            {{ $t('calc.list.group_by.options.' + value.value) }}
                        </div>
                    </template>

                    <template v-slot:option="{ option }">
                        {{ $t('calc.list.group_by.options.' + option.value) }}
                    </template>
                </multiselect>
            </div>
        </template>

        <template v-slot:filters>
            <div class="list__header-filtering">
                <Multiselect
                v-if="filterDistanceOptions"
                class="multiselect--inline"
                :placeholder="$t('calc.list.filter_by_distance.placeholder')"
                v-model="localFilterDistance"
                :options="filterDistanceOptions"
                label="name"
                :disabled="listLoader.isLoading || (listLoader && listLoader.hasOwnProperty('isLoading') && listLoader.isLoading)"
                @change="handleChangeFilterDistance"
                >
                    <template v-slot:singlelabel="{ value }">
                        <div class="multiselect-single-label">
                            {{ $t('type_run_distance.' + value.name) }}
                        </div>
                    </template>

                    <template v-slot:option="{ option }">
                        {{ $t('type_run_distance.' + option.name) }}
                    </template>
                </multiselect>

                <Multiselect
                v-if="filterTypeOptions"
                class="multiselect--inline multiselect--type"
                :placeholder="$t('calc.list.filter_by_type.placeholder')"
                v-model="localFilterType"
                :options="filterTypeOptions"
                :disabled="listLoader.isLoading || (listLoader && listLoader.hasOwnProperty('isLoading') && listLoader.isLoading)"
                @change="handleChangeFilterType"
                >
                    <template v-slot:singlelabel="{ value }">
                        <div class="multiselect-single-label">
                            {{ $t('calc.type.' + value.value) }}
                        </div>
                    </template>

                    <template v-slot:option="{ option }">
                        {{ $t('calc.type.' + option.value) }}
                    </template>
                </multiselect>

                <Multiselect
                v-if="filterYearsOptions"
                class="multiselect--inline multiselect--years"
                :placeholder="$t('calc.list.filter_by_years.placeholder')"
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
    :filterType="localFilterType"
    :filterDistance="localFilterDistance"
    :groupBy="localGroupBy"
    />
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import ListHeader from '~/components/Core/ListHeader.vue'
import CalcListTable from '~/components/List/ListTable.vue'


export default {
    components: {
        ListHeader, CalcListTable
    },
    data() {
        return {
            localFilterYears: this.filterYears,
            localFilterType: this.filterType,
            localFilterDistance: this.filterDistance,
            localGroupBy: this.groupBy
        }
    },
    watch: {
        list(payload) {
            if (this.getLocalStorageFilterByDistance()) {
                this.handleChangeFilterDistance(this.getLocalStorageFilterByDistance())
            }

            if (this.getLocalStorageFilterByType()) {
                this.handleChangeFilterType(this.getLocalStorageFilterByType())
            }

            if (this.getLocalStorageFilterByYear()) {
                this.handleChangeFilterYears(this.getLocalStorageFilterByYear())
            }

            if (this.getLocalStorageGroupBy()) {
                this.handleChangeGroupBy(this.getLocalStorageGroupBy())
            }
        },
        filterYears(payload) {
            this.localFilterYears = payload
        },
        filterType(payload) {
            this.localFilterType = payload
        },
        filterDistance(payload) {
            this.localFilterDistance = payload
        },
        groupBy(payload) {
            this.localGroupBy = payload
        }
    },
    computed: {
        ...mapState('training', [
            'listLoader', 'list', 'listColumns', 'distances',
            'filterYears', 'filterYearsOptions', 'filterType', 'filterTypeOptions', 'filterDistance', 'filterDistanceOptions',
            'groupBy', 'groupByOptions'
        ])
    },
    methods: {
        ...mapMutations('training', [
            'setListFilterByYear', 'setListFilterByType', 'setListFilterByDistance', 'setListGroupBy'
        ]),
        ...mapActions('training', [
            'getListCalc'
        ]),
        ...mapActions('training/shoes', [
            'getTrainingShoes'
        ]),
        init() {
            this.getTrainingShoes({})
            this.getListCalc({})
        },
        refreshList() {
            this.init()
        },
        handleChangeFilterYears(payload) {
            this.setLocalStorageFilterByYear(payload)
            this.setListFilterByYear(payload)
        },
        handleChangeFilterType(payload) {
            this.setLocalStorageFilterByType(payload)
            this.setListFilterByType(payload)
        },
        handleChangeFilterDistance(payload) {
            this.setLocalStorageFilterByDistance(payload)
            this.setListFilterByDistance(payload)
        },
        handleChangeGroupBy(payload) {
            this.setLocalStorageGroupBy(payload)
            this.setListGroupBy(payload)
        },
        setLocalStorageFilterByYear(payload) {
            localStorage.setItem('trening/filterBy/year', payload)
        },
        getLocalStorageFilterByYear() {
            if (localStorage.getItem('trening/filterBy/year')) {
                return parseInt(localStorage.getItem('trening/filterBy/year'))
            } else {
                return null
            }
        },
        setLocalStorageFilterByDistance(payload) {
            localStorage.setItem('trening/filterBy/distance', payload)
        },
        getLocalStorageFilterByDistance() {
            if (localStorage.getItem('trening/filterBy/distance')) {
                return parseInt(localStorage.getItem('trening/filterBy/distance'))
            } else {
                return null
            }
        },
        setLocalStorageFilterByType(payload) {
            localStorage.setItem('trening/filterBy/type', payload)
        },
        getLocalStorageFilterByType() {
            if (localStorage.getItem('trening/filterBy/type')) {
                return localStorage.getItem('trening/filterBy/type')
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
    }
}
</script>
