<template>
    <tr v-if="groupData.head && groupData.items.length > 0">
        <td
        :colspan="columns.length"
        class="training-td--group-head"
        >
            <div class="statistics">
                <strong>{{ groupTitle }}</strong>

                <div class="statistics__item">
                    {{ $t('statistics.count_training_sessions') }}: <strong>{{ groupTitleWithKilometers }}</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.total_distance') }}: <strong>{{ calculateTotalDistance() / 1000 }} km</strong>
                </div>
            </div>
        </td>
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
        },
        groupDataPrevious: {
            type: Object,
            default: null
        }
    },
    computed: {
        groupTitle() {
            return this.groupData.head === true ? this.$t('calc.list.group.head') : this.groupData.head
        },
        groupTitleWithKilometers() {
            const totalDistance = this.calculateTotalDistance(this.groupData.items)

            return this.groupData.items.length
        }
    },
    methods: {
        calculateTotalDistance() {
            return this.groupData.items.reduce((total, item) => total + item.distance, 0)
        }
    }
}
</script>
