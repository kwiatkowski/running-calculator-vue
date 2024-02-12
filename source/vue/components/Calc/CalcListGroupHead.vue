<template>
    <tr v-if="groupData.items.length > 0">
        <td
        :colspan="columns.length"
        class="group-title"
        v-html="groupData.head + ' (' + groupData.items.length + ')'"
        ></td>
    </tr>
</template>

<script>
export default {
    props: {
        columns: {
            type: Array,
            default: null
        },
        groupData: {
            type: Object,
            default: null
        }
    }
}
</script>
