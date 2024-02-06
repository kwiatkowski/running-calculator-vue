<template>
    <tr
    :key="index"
    :class="[
        item.acf.status === 'progress' ? 'tr--my_progress' : null,
        item.isEdit ? 'tr--is-edited' : null,
        item.isLoading === true ? 'tr--is-loading' : null,
        item.isError === true ? 'tr--is-error' : null,
        'tr--days-left-' + $daysDiffFromToday(item.acf.due_date),
        item.acf.status === 'done' ? 'tr--is-done' : null,
    ]"
    >
        <td v-html="computeLpNumber(index)"></td>

        <td class="todos-td--date">
            <EditInline
            :item="item"
            :edit="{ value: item.acf.due_date, field: 'acf.due_date' }"
            />
        </td>

        <td class="todos-td--name">
            <i
            class="badge-icon-type"
            :class="$displayTypeIcon(item.acf.type)"
            />

            <EditInline
            :item="item"
            :edit="{ value: item.title.rendered, field: 'title' }"
            />
        </td>

        <td class="todos-td--status">
            <EditInline
            type="status"
            field="select"
            :item="item"
            :edit="{ value: item.acf.status, field: 'acf.status' }"
            />
        </td>

        <td class="todos-td--story_points">
            <EditInline
            type="story_points"
            :item="item"
            :edit="{ value: item.acf.story_points, field: 'acf.story_points' }"
            />
        </td>
    </tr>
</template>

<script>
import EditInline from '~/components/Todo/EditInline.vue'

export default {
    components: {
        EditInline
    },
    props: {
        item: {
            type: Object,
            default: null
        },
        index: {
            type: Number,
            default: null
        },
        currentPage: {
            type: Number,
            default: null
        },
        rowsPerPage: {
            type: Number,
            default: null
        }
    },
    computed: {
        computeLpNumber() {
            return (index) => (this.currentPage - 1) * this.rowsPerPage + index + 1
        }
    }
}
</script>
