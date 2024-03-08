<template>
    <tr
    v-if="data.head"
    @click="clickTreningToggle"
    class="tr--cursor"
    >
        <td colspan="11" class="training-td--group-head">
            <Statistics
            :title="data.head ? data.head : null"
            :config="{
                isExpandable: data.head ? true : null,
                isExpand: false,
                basic: ['trainingSessions', 'totalDuration', 'totalDistance', 'longestDistance', 'fastestAveragePace'],
                advanced: ['averageSpeed', 'averageStrideLength', 'averageHeartRate', 'averageCadence', 'averageVO2Max'],
            }"
            :data="data.items"
            :dataPrevious="dataPrevious && dataPrevious.items ? dataPrevious.items : null"
            >
                <template v-slot:custom-action>
                    <button
                    ref="trainingButton"
                    class="btn btn--link btn--icon"
                    v-html="'<i class=\'bi bi bi-caret-' + (showTraining ? 'up' : 'down') + '-fill\'></i>'"
                    v-tooltip
                    :title="$t('calc.list.actions.training_details.tooltip')"
                    data-bs-trigger="hover"
                    ></button>
                </template>
            </Statistics>
        </td>
    </tr>

    <tr v-if="data.head">
        <td
        class="td--clear"
        colspan="11"
        >
            <Transition name="slidedown">
                <div v-if="showTraining">
                    <table class="list__table">
                        <ListItem
                        v-for="(item, itemIndex) in data.items"
                        :key="itemIndex"
                        :item="item"
                        :index="globalIndex(itemIndex, groupIndex)"
                        />
                    </table>
                </div>
            </Transition>
        </td>
    </tr>
</template>

<script>
import Statistics from '~/components/Core/Statistics.vue'
import ListItem from '~/components/List/ListItem.vue'

export default {
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
