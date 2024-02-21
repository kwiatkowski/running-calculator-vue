<template>
    <tr v-if="groupData.head && groupData.items.length > 0">
        <td
        :colspan="columns.length"
        class="training-td--group-head"
        >
            <div class="statistics statistics--td">
                <strong>{{ groupTitle }}</strong>

                <div class="statistics__item">
                    {{ $t('statistics.count_training_sessions') }}: <strong>{{ groupTitleWithKilometers }}</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.total_distance') }}: <strong>{{ calculateTotalDistance() / 1000 }} km</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.total_duration') }}: <strong>{{ calculateTotalDuration() }} godz.</strong>
                </div>
            </div>
        </td>
    </tr>
</template>

<script>
import moment from 'moment'

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
        },
        calculateTotalDuration() {
            const durations = this.groupData.items.map(item => item.duration)

            // convert each time to number of seconds
            const totalSeconds = durations.reduce((total, duration) => {
                const [hours, minutes, seconds] = duration.split(':').map(Number)

                return total + hours * 3600 + minutes * 60 + seconds
            }, 0)

            // create a moment.js object based on the number of seconds
            const totalDuration = moment.duration(totalSeconds, 'seconds')

            // format the sum of times as a decimal
            const formattedTotalDuration = totalDuration.asHours().toFixed(1)
            // const formattedTotalDuration = moment.utc(totalDuration.asMilliseconds()).format('HH:mm:ss')

            return formattedTotalDuration
        }
    }
}
</script>
