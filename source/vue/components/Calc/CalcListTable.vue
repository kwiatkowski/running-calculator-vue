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

            <tbody v-if="groupedData !== null && (loader && loader.hasOwnProperty('isLoading') && !loader.isLoading)">
                <CalcListGroup
                v-if="groupedData.length > 0"
                v-for="(group, groupIndex) in groupedData"
                :columns="columns"
                :data="group"
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
        }
    },
    computed: {
        groupedData() {
            if (!this.data) return [];

            // Grouping data by month
            const grouped = this.data.reduce((result, item) => {
                const month = new Date(item.date).toLocaleString('default', { month: 'long', year: 'numeric' });

                if (!result[month]) {
                    result[month] = {
                        month,
                        items: [],
                    }
                }

                result[month].items.push(item)

                return result
            }, {})

            // Transforming object into an array
            return Object.values(grouped)
        }
    },
    methods: {
        getPreviousGroupLength(groupIndex) {
            let length = 0

            for (let i = 0; i < groupIndex; i++) {
                length += this.groupedData[i].items.length
            }

            return length
        }
    }
}
</script>
