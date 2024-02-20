<template>
    <CalcListGroupHead
    :columns="columns"
    :groupData="data"
    />

    <CalcListItem
    v-for="(item, itemIndex) in data.items"
    :key="itemIndex"
    :item="item"
    :index="globalIndex(itemIndex, groupIndex)"
    />
</template>

<script>
import CalcListItem from '~/components/Calc/CalcListItem.vue'
import CalcListGroupHead from '~/components/Calc/CalcListGroupHead.vue'

export default {
    components: {
        CalcListItem, CalcListGroupHead
    },
    props: {
        columns: {
            type: Array,
            default: null
        },
        data: {
            type: Object,
            default: null
        },
        groupIndex: {
            type: Number,
            default: null
        },
        previousGroupLength: {
            type: Number,
            default: 0
        }
    },
    methods: {
        globalIndex(itemIndex) {
            return this.previousGroupLength + itemIndex
        }
    }
}
</script>