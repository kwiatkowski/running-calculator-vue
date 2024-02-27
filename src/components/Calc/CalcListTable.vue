<template>
    <div
    :class="['list__table-wrap']"
    v-loader="{ loader: loader }"
    >
        <table class="list__table">
            <thead v-if="columns !== null && columns.length > 0">
                <tr>
                    <th
                    v-for="(column, index) in columns"
                    :key="index"
                    :class="'calc-th--' + column.name"
                    v-text="$t('calc.list.columns.' + column.name)"
                    ></th>
                </tr>
            </thead>

            <tbody v-if="dataDisplay !== null && (loader && loader.hasOwnProperty('isLoading') && !loader.isLoading)">
                <CalcListGroup
                v-if="dataDisplay.length > 0"
                v-for="(group, groupIndex) in dataDisplay"
                :columns="columns"
                :data="group"
                :data-previous="groupIndex < dataDisplay.length ? dataDisplay[groupIndex + 1] : null"
                :groupIndex="groupIndex"
                :previousGroupLength="getPreviousGroupLength(groupIndex)"
                />

                <tr v-else>
                    <td class="td--table-empty" :colspan="columns.length" v-html="'Brak elementów'"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import CalcListGroup from '~/components/Calc/CalcListGroup.vue'

export default {
    components: {
        CalcListGroup
    },
    props: {
        loader: {
            type: Object,
            default: null
        },
        columns: {
            type: Array,
            default: null
        },
        data: {
            type: Array,
            default: null
        },
        filterYears: {
            type: Number,
            default: null
        },
        filterType: {
            type: String,
            default: null
        },
        filterDistance: {
            type: Number,
            default: null
        },
        groupBy: {
            type: String,
            default: null
        }
    },
    computed: {
        dataDisplay() {
            if (!this.data) return []

                let filteredData = this.filterYears
                    ? this.data.filter(item => new Date(item.date).getFullYear() === this.filterYears)
                    : this.data

                if (this.filterType) {
                    filteredData = filteredData.filter(item => item.type === this.filterType)
                }

                if (this.filterDistance) {
                    filteredData = filteredData.filter(item => item.distance >= this.filterDistance)
                }

                if (this.groupBy) {
                    const groupedData = filteredData.reduce((result, item) => {
                        const keyValue = new Date(item.date).toLocaleString('default', { [this.groupBy]: 'long', year: 'numeric' })

                        if (!result[keyValue]) {
                            result[keyValue] = {
                                head: keyValue,
                                items: []
                            }
                        }

                        result[keyValue].items.push(item)

                    return result
                }, {})

                const sortedData = Object.values(groupedData).sort((a, b) => {
                    const yearA = new Date(a.head).getFullYear()
                    const yearB = new Date(b.head).getFullYear()

                    return yearB - yearA
                })

                return sortedData
            } else {
                return [{
                    head: false,
                    items: filteredData
                }]
            }
        }
    },
    methods: {
        getPreviousGroupLength(groupIndex) {
            let length = 0

            for (let i = 0; i < groupIndex; i++) {
                length += this.dataDisplay[i].items.length
            }

            return length
        },
        getPreviousMonthData(groupIndex) {
            if (groupIndex > 0) {
                return this.previousMonthData[groupIndex - 1] || null
            }

            return null
        }
    }
}
</script>
