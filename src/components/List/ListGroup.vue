<template>
    <tr v-if="data.head">
        <td colspan="11" class="training-td--group-head">
            <Statistics
            :title="data.head ? data.head : null"
            :config="{
                isExpandable: data.head ? true : null,
                isExpand: false,
                basic: ['trainingSessions', 'totalDistance', 'longestDistance', 'totalDuration', 'fastestAveragePace'],
                advanced: ['averageStrideLength', 'averageVO2Max', 'averageCadence', 'averageHeartRate', 'averageSpeed'],
            }"
            :data="data.items"
            :dataPrevious="dataPrevious && dataPrevious.items ? dataPrevious.items : null"
            >
                <template v-slot:custom-action>
                    <button
                    ref="trainingButton"
                    class="btn btn--link btn--icon"
                    @click="clickTreningToggle"
                    v-html="'<i class=\'bi bi-arrow-' + (showTraining ? 'up' : 'down') + '-square-fill\'></i>'"
                    v-tooltip
                    :title="$t('calc.list.actions.training_details.tooltip')"
                    data-bs-trigger="hover"
                    ></button>
                </template>
            </Statistics>
        </td>
    </tr>

    <ListItem
    v-if="showTraining"
    v-for="(item, itemIndex) in data.items"
    :key="itemIndex"
    :item="item"
    :index="globalIndex(itemIndex, groupIndex)"
    />
</template>

<script>
import Statistics from '~/components/Core/Statistics.vue'
import ListItem from '~/components/List/ListItem.vue'

export default {
    compatConfig: { MODE: 3 },
    components: {
        Statistics, ListItem
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
