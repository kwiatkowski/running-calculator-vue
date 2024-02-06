<template>
    <div
    :class="[
        'list__table-wrap',
        'list__table-wrap--' + rowsPerPage,
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
                    :class="'todos-th--' + column.name"
                    v-text="$t('todos.list.columns.' + column.name)"
                    ></th>
                </tr>
            </thead>

            <tbody v-if="data !== null && (loader && loader.hasOwnProperty('isLoading') && !loader.isLoading)">
                <template v-if="data.length > 0">
                    <template
                    v-for="(item, index) in data"
                    :key="index"
                    >
                        <TodoListItem
                        :item="item"
                        :index="index"
                        :currentPage="currentPage"
                        :rowsPerPage="rowsPerPage"
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
import TodoListItem from '~/components/Todo/TodoListItem.vue'

export default {
    components: {
        TodoListItem
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
        currentPage: {
            type: Number,
            default: 1
        },
        rowsPerPage: {
            type: Number,
            default: 10
        }
    }
}
</script>
