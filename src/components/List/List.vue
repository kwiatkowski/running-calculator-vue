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
                v-model="groupBy"
                :placeholder="$t('calc.list.group_by.placeholder')"
                :options="groupByOptions"
                :disabled="listLoader && listLoader.isLoading"
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
                v-model="filterDistance"
                :placeholder="$t('calc.list.filter_by_distance.placeholder')"
                :options="filterDistanceOptions"
                label="name"
                :disabled="listLoader && listLoader.isLoading"
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
                v-model="filterType"
                :placeholder="$t('calc.list.filter_by_type.placeholder')"
                :options="filterTypeOptions"
                :disabled="listLoader && listLoader.isLoading"
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
                v-model="filterYears"
                :placeholder="$t('calc.list.filter_by_years.placeholder')"
                :options="filterYearsOptions"
                :disabled="listLoader && listLoader.isLoading"
                @change="handleChangeFilterYears"
                />
            </div>
        </template>
    </ListHeader>

    <ListTable
    :loader="listLoader"
    :columns="listColumns"
    :data="list"
    :filterYears="filterYears"
    :filterType="filterType"
    :filterDistance="filterDistance"
    :groupBy="groupBy"
    />
</template>

<script>
import { mapState, mapActions } from 'vuex'

import ListHeader from '~/components/Core/ListHeader.vue'
import ListTable from '~/components/List/ListTable.vue'


export default {
    components: {
        ListHeader, ListTable
    },
    data() {
        return {
            filterYears: this.getLocalStorageFilterByYear(),
            filterType: this.getLocalStorageFilterByType(),
            filterDistance: this.getLocalStorageFilterByDistance(),
            groupBy: this.getLocalStorageGroupBy()
        }
    },
    watch: {
        list(payload) {
            this.getDataLocalStorage()
        }
    },
    computed: {
        ...mapState('training', [
            'listLoader', 'list', 'listColumns', 'distances',
            'groupByOptions', 'filterYearsOptions', 'filterTypeOptions', 'filterDistanceOptions'
        ])
    },
    methods: {
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
        getDataLocalStorage() {
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
        refreshList() {
            this.init()
        },
        handleChangeFilterYears(payload) {
            this.filterYears = payload

            payload ? this.setLocalStorageFilterByYear(payload) : localStorage.removeItem('trening/filterBy/year')
        },
        handleChangeFilterType(payload) {
            this.filterType = payload

            payload ? this.setLocalStorageFilterByType(payload) : localStorage.removeItem('trening/filterBy/type')
        },
        handleChangeFilterDistance(payload) {
            this.filterDistance = payload
            
            payload ? this.setLocalStorageFilterByDistance(payload) : localStorage.removeItem('trening/filterBy/distance')
        },
        handleChangeGroupBy(payload) {
            this.groupBy = payload

            payload ? this.setLocalStorageGroupBy(payload) : localStorage.removeItem('trening/groupBy')
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
