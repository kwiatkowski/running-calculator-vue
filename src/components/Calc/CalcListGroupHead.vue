<template>
    <tr v-if="groupData.head && groupData.items.length > 0">
        <td
        :colspan="columns.length"
        class="training-td--group-head"
        >
            <div class="statistics statistics--td">
                <div class="section__title">{{ groupTitle }}</div>

                <div class="statistics__item">
                    {{ $t('statistics.count_training_sessions') }}: <strong>{{ groupTitleWithKilometers }}</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.total_distance') }}: <strong>{{ $filters.formatDistance(totalDistance, 'km', true) }}</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.longest_distance') }}: <strong>{{ $filters.formatDistance(longestDistance, 'km', true) }}</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.total_duration') }}: <strong>{{ totalDuration }} godz.</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.fastest_average_pace') }}: <strong>{{ fastestAveragePace }}</strong>
                </div>


                <div class="statistics__item">
                    Średnia Długość Kroku: <strong>{{ averageStrideLength.toFixed(2) }} cm</strong>
                </div>

                <div class="statistics__item">
                    Średni VO2 max: <strong>{{ averageVO2Max.toFixed(2) }} ml/kg/min</strong>
                </div>

                <div class="statistics__item">
                    Średnia Kadencja: <strong>{{ averageCadence.toFixed(2) }} kroki/min</strong>
                </div>

                <div class="statistics__item">
                    Średnie Tętno: <strong>{{ averageHeartRate.toFixed(2) }} uderzeń/min</strong>
                </div>

                <div class="statistics__item">
                    Średnia Prędkość: <strong>{{ averageSpeed.toFixed(2) }} km/h</strong>
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
            return this.groupData.items.length
        },
        totalDistance() {
            let totalDistance = null

            this.groupData.items.forEach((item) => {
                if (item.distance) {
                    totalDistance += item.distance
                }
            })

            return totalDistance
        },
        longestDistance() {
            if (this.groupData.items.length === 0) {
                return null
            }

            let maxDistance = Math.max(...this.groupData.items.map(entry => entry.distance))

            return maxDistance
        },
        totalDuration() {
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
        },
        fastestAveragePace() {
            if (!this.groupData.items || this.groupData.items.length === 0) {
                return '-'
            }

            const fastestPace = this.groupData.items.reduce((minPace, entry) => {
                const paceInSeconds = moment.duration(entry.average_pace).asSeconds()
                const minPaceInSeconds = moment.duration(minPace).asSeconds()

                return paceInSeconds < minPaceInSeconds ? entry.average_pace : minPace
            }, this.groupData.items[0].average_pace)

            return `${fastestPace}`
        },
        averageStrideLength() {
            const totalStrideLength = this.groupData.items.reduce((acc, activity) => acc + activity.stride_length, 0)

            return totalStrideLength / this.groupData.items.length
        },
        averageVO2Max() {
            const totalVO2Max = this.groupData.items.reduce((acc, activity) => acc + activity.v02max, 0)

            return totalVO2Max / this.groupData.items.length
        },
        averageCadence() {
            const totalCadence = this.groupData.items.reduce((acc, activity) => acc + parseInt(activity.cadence), 0)

            return totalCadence / this.groupData.items.length
        },
        averageHeartRate() {
            const totalHeartRate = this.groupData.items.reduce((acc, activity) => acc + activity.average_heart_rate, 0)

            return totalHeartRate / this.groupData.items.length
        },
        averageSpeed() {
            const totalSpeed = this.groupData.items.reduce((acc, activity) => acc + parseFloat(activity.average_speed), 0)

            return totalSpeed / this.groupData.items.length
        }
    }
}
</script>
