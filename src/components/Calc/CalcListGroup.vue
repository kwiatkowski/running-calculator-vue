<template>
    <tr>
        <td colspan="11" class="training-td--group-head">
            <Statistics
            :title="data.head ? data.head : null"
            :config="{
                basic: ['totalDistance', 'longestDistance', 'totalDuration', 'fastestAveragePace'],
                advanced: ['averageStrideLength', 'averageVO2Max', 'averageCadence', 'averageHeartRate', 'averageSpeed'],
            }"
            :data="data.items"
            :dataPrevious="dataPrevious && dataPrevious.items ? dataPrevious.items : null"
            />

            <div class="statistics__actions">
                <button
                @click="clickTreningToggle"
                v-html="showTraining ? 'Zwiń' : 'Rozwiń'"
                ></button>
            </div>
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
