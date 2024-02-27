<template>
    <div class="statistics">
        <div
        v-if="title && data && config"
        class="statistics__title"
        v-html="`${title} (${countTrainingSessions})`"
        ></div>

        <template v-if="data && config">
            <div
            class="statistics__items statistics__items--basic"
            v-if="config.basic"
            >
                <div
                class="statistics__item"
                v-for="(item, itemKey) in config.basic"
                :key="itemKey"
                >
                    {{ $t(`statistics.${camelToSnake(item)}`) }}: <strong>{{ this[item] }}</strong>

                    <span v-if="dataPrevious && item === 'totalDistance' && this[item + 'Previous']">
                        ({{ getTotalDistanceChangePercentage(this[item + 'Previous'], this[item]) }})
                    </span>
                </div>
            </div>

            <div
            class="statistics__items statistics__items--advanced"
            v-if="config.advanced"
            >
                <div
                class="statistics__item"
                v-for="(item, itemKey) in config.advanced"
                :key="itemKey"
                >
                    {{ $t(`statistics.${camelToSnake(item)}`) }}: <strong>{{ this[item] }}</strong>
                </div>
            </div>
        </template>

        <div
        v-if="distances"
        class="statistics__items"
        >
            <div
            class="statistics__title"
            v-html="$t('statistics.titles.distances')"
            ></div>

            <div
            class="statistics__item-separator"
            v-for="(distance, distanceIndex) in distances"
            :key="distanceIndex">
                <strong>{{ $t(`type_run_distance.${distance.name}`) }}</strong> ({{ getCountTrainingSessionsForDistance(distance.value) }})

                <div class="statistics__item">
                    {{ $t('statistics.fastest_average_pace') }}: <strong>{{ getFastestAveragePaceForDistance(distance.value) }}</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.fastest_time') }}: <strong>{{ getTimeToRunForDistance(distance.value) }}</strong>
                </div>
            </div>
        </div>

        <div
        v-if="shoes"
        class="statistics__items"
        >
            <div
            class="statistics__title"
            v-html="$t('statistics.titles.shoes')"
            ></div>

            <div
            class="statistics__item-separator"
            v-for="(shoe, shoeIndex) in shoes"
            :key="shoeIndex"
            >
                <strong>{{ shoe.name }}</strong> ({{ getCountTrainingSessionsForShoes(shoe.count) }})

                <div class="statistics__item">
                    {{ $t('statistics.total_distance') }}: <strong>{{ $filters.formatDistance(getTotalDistanceForShoes(shoe.id), 'km', true) }}</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.wear') }}: <strong>{{ getUsagePercentageShoes(shoe, true) }}</strong>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'moment-duration-format'
import moment from 'moment'

export default {
    props: {
        title: {
            type: String,
            default: null
        },
        config: {
            type: Object,
            default: null
        },
        data: {
            type: Array,
            default: null
        },
        dataPrevious: {
            type: Array,
            default: null
        },
        distances: {
            type: Array,
            default: null
        },
        shoes: {
            type: Array,
            default: null
        }
    },
    computed: {
        countTrainingSessions() {
            if (!this.data || this.data.length === 0) {
                return '-'
            }

            return this.data.length
        },



        // todo:
        totalDistance() {
            if (this.data.length === 0) {
                return '-'
            }

            let result = this.data.reduce((sum, item) => sum + item.distance, 0)

            result = (result / 1000).toFixed(2)

            return `${result} km`
        },
        totalDistancePrevious() {
            if (!this.dataPrevious || this.dataPrevious.length === 0) {
                return '-'
            }

            let result = this.dataPrevious.reduce((sum, item) => sum + item.distance, 0)

            result = (result / 1000).toFixed(2)

            return `${result} km`
        },



        longestDistance() {
            if (this.data.length === 0) {
                return '-'
            }

            let result = Math.max(...this.data.map(entry => entry.distance))

            result = (result / 1000).toFixed(2)

            return `${result} km`
        },
        totalDuration() {
            if (this.data.length === 0) {
                return '-'
            }

            const durations = this.data.map(item => item.duration)

            // convert each time to number of seconds
            const totalSeconds = durations.reduce((total, duration) => {
                const [hours, minutes, seconds] = duration.split(':').map(Number)

                return total + hours * 3600 + minutes * 60 + seconds
            }, 0)

            // create a moment.js object based on the number of seconds
            const totalDuration = moment.duration(totalSeconds, 'seconds')

            // format the sum of times as a decimal
            const formattedTotalDuration = totalDuration.asHours().toFixed(1)

            return `${formattedTotalDuration} godz.`
        },
        fastestAveragePace() {
            if (this.data.length === 0) {
                return '-'
            }

            const fastestAveragePace = this.data.reduce((fastest, current) => {
                return current.average_pace < fastest.average_pace ? current : fastest
            })

            return fastestAveragePace.average_pace
        },
        averageStrideLength() {
            if (this.data.length === 0) {
                return '-'
            }

            const totalStrideLength = this.data.reduce((acc, activity) => acc + activity.stride_length, 0)
            const result = Math.round(totalStrideLength / this.data.length)

            return `${result} cm`
        },
        averageVO2Max() {
            if (this.data.length === 0) {
                return '-'
            }

            const totalVO2Max = this.data.reduce((acc, activity) => acc + activity.v02max, 0)
            const result = Math.round(totalVO2Max / this.data.length)

            return `${result} ml/kg/min`
        },
        averageCadence() {
            if (this.data.length === 0) {
                return '-'
            }

            const totalCadence = this.data.reduce((acc, activity) => acc + parseInt(activity.cadence || 0), 0)
            const result = Math.round(totalCadence / this.data.length)

            return `${result} kroki/min`
        },
        averageHeartRate() {
            if (this.data.length === 0) {
                return '-'
            }

            const totalHeartRate = this.data.reduce((acc, activity) => acc + activity.average_heart_rate, 0)
            const result = Math.round(totalHeartRate / this.data.length)

            return `${result} uderzeń/min`
        },
        averageSpeed() {
            if (this.data.length === 0) {
                return '-'
            }

            const totalSpeed = this.data.reduce((acc, activity) => acc + parseFloat(activity.average_speed), 0)
            const result = (totalSpeed / this.data.length).toFixed(2)

            return `${result} km/h`
        }
    },
    methods: {
        camelToSnake(str) {
            if (typeof str !== 'string') {
                return str
            }

            return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
        },
        getCountTrainingSessionsForDistance(minDistance) {
            if (!this.data || this.data.length === 0) {
                return '-'
            }

            // filter runs above minimum distance
            const runsAboveMinDistance = this.data.filter(entry => entry.distance > minDistance)

            if (runsAboveMinDistance.length === 0) {
                return '-'
            }

            return runsAboveMinDistance.length
        },
        getFastestAveragePaceForDistance(minDistance) {
            if (!this.data || this.data.length === 0) {
                return '-'
            }

            // filter runs above minimum distance
            const runsAboveMinDistance = this.data.filter(entry => entry.distance > minDistance)

            if (runsAboveMinDistance.length === 0) {
                return '-'
            }

            // find fastest average pace for runs over the minimum distance
            const fastestPace = runsAboveMinDistance.reduce((minPace, entry) => {
                const paceInSeconds = moment.duration(entry.average_pace).asSeconds()
                const minPaceInSeconds = moment.duration(minPace).asSeconds()

                return paceInSeconds < minPaceInSeconds ? entry.average_pace : minPace
            }, runsAboveMinDistance[0].average_pace)

            return fastestPace
        },
        getTimeToRunForDistance(minDistance) {
            if (!this.data || this.data.length === 0) {
                return '-'
            }

            // filter runs above minimum distance
            const runsAboveMinDistance = this.data.filter(entry => entry.distance > minDistance)

            if (runsAboveMinDistance.length === 0) {
                return '-'
            }

            // find fastest average pace for runs over the minimum distance
            const fastestPace = runsAboveMinDistance.reduce((minPace, entry) => {
                const paceInSeconds = moment.duration(entry.average_pace).asSeconds()
                const minPaceInSeconds = moment.duration(minPace).asSeconds()

                return paceInSeconds < minPaceInSeconds ? entry.average_pace : minPace
            }, runsAboveMinDistance[0].average_pace)

            // Calculate the time to run a given distance in seconds
            const [minutes, seconds] = fastestPace.split(':').map(Number)
            const timeInSeconds = (minutes * 60 + seconds) * (minDistance / 1000)

            // Create a moment.js object based on the number of seconds
            const duration = moment.duration(timeInSeconds, 'seconds')

            // Use moment.js to format the time
            const formattedTime = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')

            return formattedTime
        },
        getCountTrainingSessionsForShoes(count) {
            if (!this.shoes || this.shoes.length === 0 || count === 0) {
                return '-'
            }

            return count
        },
        getTotalDistanceForShoes(shoeId) {
            let totalDistance = null

            this.data.forEach((item) => {
                if (item.shoe === shoeId) {
                    totalDistance += item.distance
                }
            })

            return totalDistance
        },
        getUsagePercentageShoes(shoe, withUnit = false) {
            if (withUnit && (!this.data || this.data.length === 0 || shoe.count === 0)) {
                return '-'
            }

            const maxDistance = 800

            const totalDistance = this.$filters.formatDistance(this.getTotalDistanceForShoes(shoe.id), 'km')

            if (totalDistance >= maxDistance) {
                return `${100}%`
            }

            const completedDistance = Math.min(totalDistance, maxDistance)

            let totalUsage = (completedDistance / maxDistance) * 100

            totalUsage = Math.min(100, totalUsage).toFixed(0)

            return withUnit ? `${totalUsage}%` : totalUsage

        },


        // todo:
        getTotalDistanceChangePercentage(previous, current) {
            const previousDistance = parseFloat(previous);
            const currentDistance = parseFloat(current);

            if (previousDistance === 0) {
                return '100%';
            }

            const changePercentage = ((currentDistance - previousDistance) / previousDistance) * 100;

            const symbol = changePercentage >= 0 ? '+' : '-';
            const formattedChangePercentage = `${symbol}${Math.abs(changePercentage).toFixed(2)}%`;

            return formattedChangePercentage;
        }
    }
}
</script>