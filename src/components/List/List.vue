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
            localStorageKeys: {
                filterByYear: 'filterBy/year',
                filterByDistance: 'filterBy/distance',
                filterByType: 'filterBy/type',
                groupBy: 'groupBy'
            },
            filterYears: this.getLocalStorage('filterBy/year'),
            filterType: this.getLocalStorage('filterBy/type'),
            filterDistance: this.getLocalStorage('filterBy/distance'),
            groupBy: this.getLocalStorage('groupBy')
        }
    },
    watch: {
        list(payload) {
            this.getDataLocalStorage()
        }
    },
    computed: {
        ...mapState('training', [
            'listLoader', 'list', 'listColumns', 'distances', 'groupByOptions', 'filterYearsOptions', 'filterTypeOptions', 'filterDistanceOptions'
        ])
    },
    methods: {
        ...mapActions('training', [
            'getTrainingList'
        ]),
        ...mapActions('training/shoes', [
            'getTrainingShoes'
        ]),
        refreshList() {
            this.getTrainingList({})
        },
        getDataLocalStorage() {
            if (this.getLocalStorage('filterBy/year')) {
                this.handleChangeFilterYears(this.getLocalStorage('filterBy/year'))
            }

            if (this.getLocalStorage('filterBy/distance')) {
                this.handleChangeFilterDistance(this.getLocalStorage('filterBy/distance'))
            }

            if (this.getLocalStorage('filterBy/type')) {
                this.handleChangeFilterType(this.getLocalStorage('filterBy/type'))
            }

            if (this.getLocalStorage('groupBy')) {
                this.handleChangeGroupBy(this.getLocalStorage('groupBy'))
            }
        },
        handleChangeFilterYears(payload) {
            this.filterYears = payload

            payload ? this.setLocalStorage('filterBy/year', payload) : localStorage.removeItem(`training/filterBy/year`)
        },
        handleChangeFilterType(payload) {
            this.filterType = payload

            payload ? this.setLocalStorage('filterBy/type', payload) : localStorage.removeItem(`training/filterBy/type`)
        },
        handleChangeFilterDistance(payload) {
            this.filterDistance = payload

            payload ? this.setLocalStorage('filterBy/distance', payload) : localStorage.removeItem(`training/filterBy/distance`)
        },
        handleChangeGroupBy(payload) {
            this.groupBy = payload

            payload ? this.setLocalStorage('groupBy', payload) : localStorage.removeItem(`training/filterBy/groupBy`)
        },
        setLocalStorage(key, payload) {
            localStorage.setItem(`training/${key}`, JSON.stringify(payload))
        },
        getLocalStorage(key) {
            const value = localStorage.getItem('training/' + key)

            return value ? JSON.parse(value) : null
        }
    }
}
</script>
