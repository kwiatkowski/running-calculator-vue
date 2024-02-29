<template>
    <tr>
        <td colspan="11" class="training-td--group-head">
            <Statistics
            :title="data.head ? data.head : null"
            :config="{
                isExpandable: true,
                isExpand: false,
                basic: ['trainingSessions', 'totalDistance', 'longestDistance', 'totalDuration', 'fastestAveragePace'],
                advanced: ['averageStrideLength', 'averageVO2Max', 'averageCadence', 'averageHeartRate', 'averageSpeed'],
            }"
            :data="data.items"
            :dataPrevious="dataPrevious && dataPrevious.items ? dataPrevious.items : null"
            >
                <template v-slot:custom-action>
                    <button
                    class="btn btn--link"
                    @click="clickTreningToggle"
                    v-html="'<i class=\'icon-angle-' + (showTraining ? 'up' : 'down') + '\'></i>'"
                    ></button>
                </template>
            </Statistics>
        </td>
    </tr>

    <CalcListItem
    v-if="showTraining"
    v-for="(item, itemIndex) in data.items"
    :key="itemIndex"
    :item="item"
    :index="globalIndex(itemIndex, groupIndex)"
    />
</template>

<script>
import Statistics from '~/components/Training/Statistics.vue'
import CalcListItem from '~/components/Calc/CalcListItem.vue'

export default {
    components: {
        Statistics, CalcListItem
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
        dataPrevious: {
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
    data() {
        return {
            showTraining: this.groupIndex > 0 ? false : true,
        }
    },
    methods: {
        globalIndex(itemIndex) {
            return this.previousGroupLength + itemIndex
        },
        clickTreningToggle() {
            this.showTraining = !this.showTraining
        }
    }
}
</script>
