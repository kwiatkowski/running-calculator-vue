<template>
    <div
    :class="[
        'list__table-wrap'
    ]"
    v-loader="{
        loader: loader
    }"
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

            <tbody v-if="data !== null && (loader && loader.hasOwnProperty('isLoading') && !loader.isLoading)">
                <template v-if="data.length > 0">
                    <template
                    v-for="(item, index) in data"
                    :key="index"
                    >
                        <CalcListItem
                        :item="item"
                        :index="index"
                        />
                    </template>
                </template>

                <tr v-else>
                    <td
                    class="td--table-empty"
                    :colspan="columns.length"
                    v-html="'Brak elementów'"
                    ></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import CalcListItem from '~/components/Calc/CalcListItem.vue'

export default {
    components: {
        CalcListItem
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
    }
}
</script>
