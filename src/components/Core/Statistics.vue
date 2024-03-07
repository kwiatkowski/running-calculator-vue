<template>
    <div class="statistics">
        <div
        class="statistics__header"
        v-if="title && data && config"
        >
            <div
            class="statistics__title"
            v-html="title"
            ></div>

            <div
            class="statistics__items statistics__items--inline"
            v-if="!statisticsExpand && config.basic"
            >
                <StatisticsItem
                v-for="(item, itemKey) in config.basic"
                :key="itemKey"
                :data="this[item]"
                />
            </div>

            <div class="statistics__actions">
                <button
                v-if="config.isExpandable"
                class="btn btn--link btn--icon"
                @click="clickStatisticsExpandToggle"
                v-html="'<i class=\'bi bi-clipboard2-' + (statisticsExpand ? 'minus' : 'plus') + '\'></i>'"
                v-tooltip
                :title="$t('calc.list.actions.statistics_details.tooltip')"
                data-bs-trigger="hover"
                ></button>

                <slot name="custom-action"></slot>
            </div>
        </div>

        <template v-if="statisticsExpand">
            <template v-if="data && config">
                <div
                class="statistics__items statistics__items--basic"
                v-if="config.basic"
                >
                    <StatisticsItem
                    v-for="(item, itemKey) in config.basic"
                    :key="itemKey"
                    :data="this[item]"
                    :showDifference="true"
                    :label="item"
                    />
                </div>

                <div
                class="statistics__items statistics__items--advanced"
                v-if="config.advanced"
                >
                    <StatisticsItem
                    v-for="(item, itemKey) in config.advanced"
                    :key="itemKey"
                    :data="this[item]"
                    :showDifference="true"
                    :label="item"
                    />
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
        </template>
    </div>
</template>

<script>
import 'moment-duration-format'
import moment from 'moment'

import StatisticsItem from '~/components/Core/StatisticsItem.vue'

export default {
    components: {
        StatisticsItem
    },
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
    data() {
        return {
            statisticsExpand: this.config.isExpandable && !this.config.isExpand ? false : true
        }
    },
    computed: {
        trainingSessions() {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {
                value: this.data.length
            }

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                result.valuePrevious = this.dataPrevious.length
            }

            return result
        },
        totalDuration() {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {
                value: this.calculateTotalDuration(this.data),
                unit: 'godz.'
            }

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                result.valuePrevious = this.calculateTotalDuration(this.dataPrevious)
            }

            return result
        },
        totalDistance() {
            if (this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'km'
            }

            const distance = this.data.reduce((sum, item) => sum + item.distance, 0)

            result.value = (distance / 1000).toFixed(2)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const distancePrevious = this.dataPrevious.reduce((sum, item) => sum + item.distance, 0)

                result.valuePrevious = (distancePrevious / 1000).toFixed(2)
            }

            return result
        },
        longestDistance() {
            if (this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'km'
            }

            const distance = Math.max(...this.data.map(entry => entry.distance))

            result.value = (distance / 1000).toFixed(2)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const distancePrevious = Math.max(...this.dataPrevious.map(entry => entry.distance))

                result.valuePrevious = (distancePrevious / 1000).toFixed(2)
            }

            return result
        },
        // todo:
        fastestAveragePace() {
            if (this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'min/km'
            }

            const fastestAveragePace = this.data.reduce((fastest, current) => {
                return current.average_pace < fastest.average_pace ? current : fastest
            })

            result.valueDisplay = fastestAveragePace.average_pace

            const [hours, minutes] = result.valueDisplay.split(':').map(Number)
            const timeInSeconds = hours * 3600 + minutes * 60

            result.value = timeInSeconds

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const fastestAveragePacePrevious = this.dataPrevious.reduce((fastest, current) => {
                    return current.average_pace < fastest.average_pace ? current : fastest
                })

                result.valueDisplayPrevious = fastestAveragePacePrevious.average_pace

                const [hoursPrevious, minutesPrevious] = result.valueDisplayPrevious.split(':').map(Number)
                const timeInSecondsPrevious = hoursPrevious * 3600 + minutesPrevious * 60

                result.valuePrevious = timeInSecondsPrevious
            }

            return result
        },
        averageStrideLength() {
            if (this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'cm'
            }

            const totalStrideLength = this.data.reduce((acc, activity) => acc + activity.stride_length, 0)

            result.value = Math.round(totalStrideLength / this.data.length)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalStrideLengthPrevious = this.dataPrevious.reduce((acc, activity) => acc + activity.stride_length, 0)

                result.valuePrevious = Math.round(totalStrideLengthPrevious / this.dataPrevious.length)
            }

            return result
        },
        averageVO2Max() {
            if (this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'ml/kg/min'
            }

            const totalVO2Max = this.data.reduce((acc, activity) => acc + activity.v02max, 0)

            result.value = Math.round(totalVO2Max / this.data.length)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalVO2MaxPrevious = this.dataPrevious.reduce((acc, activity) => acc + activity.v02max, 0)

                result.valuePrevious = Math.round(totalVO2MaxPrevious / this.dataPrevious.length)
            }

            return result
        },
        averageCadence() {
            if (this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'kroki/min'
            }

            const totalCadence = this.data.reduce((acc, activity) => acc + parseInt(activity.cadence || 0), 0)

            result.value = Math.round(totalCadence / this.data.length)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalCadencePrevious = this.dataPrevious.reduce((acc, activity) => acc + parseInt(activity.cadence || 0), 0)

                result.valuePrevious = Math.round(totalCadencePrevious / this.dataPrevious.length)
            }

            return result
        },
        averageHeartRate() {
            if (this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'uderzeń/min'
            }

            const totalHeartRate = this.data.reduce((acc, activity) => acc + activity.average_heart_rate, 0)

            result.value = Math.round(totalHeartRate / this.data.length)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalHeartRatePrevious = this.dataPrevious.reduce((acc, activity) => acc + activity.average_heart_rate, 0)

                result.valuePrevious = Math.round(totalHeartRatePrevious / this.dataPrevious.length)
            }

            return result
        },
        averageSpeed() {
            if (this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'km/h'
            }

            const totalSpeed = this.data.reduce((acc, activity) => acc + parseFloat(activity.average_speed), 0)

            result.value = (totalSpeed / this.data.length).toFixed(2)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalSpeedPrevious = this.dataPrevious.reduce((acc, activity) => acc + parseFloat(activity.average_speed), 0)

                result.valuePrevious = Math.round(totalSpeedPrevious / this.dataPrevious.length)
            }

            return result
        }
    },
    methods: {
        clickStatisticsExpandToggle() {
            this.statisticsExpand = !this.statisticsExpand
        },
        calculateTotalDuration(data) {
            if (!data || data.length === 0) {
                return {
                    value: null
                }
            }

            const durations = data.map(item => item.duration)

            const totalSeconds = durations.reduce((total, duration) => {
                const [hours, minutes, seconds] = duration.split(':').map(Number)

                return total + hours * 3600 + minutes * 60 + seconds
            }, 0)

            const totalDuration = moment.duration(totalSeconds, 'seconds')
            const formattedTotalDuration = totalDuration.asHours().toFixed(1)

            return formattedTotalDuration
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

        }
    }
}
</script>