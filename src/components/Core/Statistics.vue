<template>
    <div class="statistics statistics--basic">
        <div
        class="statistics__header"
        v-if="title && data && config"
        >
            <div
            class="statistics__title"
            v-html="title"
            ></div>

            <Transition name="fade">
                <div
                class="statistics__items statistics__items--inline"
                v-if="!statisticsExpand && config.basic"
                >
                    <StatisticsItem
                    v-for="(item, itemKey) in config.basic"
                    :key="itemKey"
                    :data="this[item]"
                    @click.stop
                    />
                </div>
            </Transition>

            <div
            class="statistics__actions"
            v-if="config.isExpandable"
            >
                <button
                class="btn btn--link btn--icon"
                v-html="'<i class=\'bi bi-clipboard2-' + (statisticsExpand ? 'minus' : 'plus') + '\'></i>'"
                v-tooltip
                :title="$t('calc.list.actions.statistics_details.tooltip')"
                data-bs-trigger="hover"
                @click.stop="clickStatisticsExpandToggle"
                ></button>

                <slot name="custom-action"></slot>
            </div>
        </div>

        <Transition
        name="slidedown"
        class="statistics__content"
        v-loader:blur="{
            loader: dataLoader,
            ignoreError: true,
        }"
        @click.stop
        >
            <div v-if="statisticsExpand">
                <template v-if="data && config">
                    <div
                    class="statistics__items"
                    v-if="config.basic"
                    >
                        <div
                        class="statistics__item"
                        v-for="(item, itemKey) in config.basic"
                        :key="itemKey"
                        >
                            <StatisticsItem
                            :data="this[item]"
                            :showDifference="true"
                            :label="item"
                            />
                        </div>
                    </div>

                    <div
                    class="statistics__items"
                    v-if="config.advanced"
                    >
                        <div
                        class="statistics__item"
                        v-for="(item, itemKey) in config.advanced"
                        :key="itemKey"
                        >
                            <StatisticsItem
                            :data="this[item]"
                            :showDifference="true"
                            :label="item"
                            />
                        </div>
                    </div>
                </template>
            </div>
        </Transition>
    </div>

    <div
    v-if="distances"
    class="statistics statistics--distances"
    >
        <div class="statistics__header">
            <div
            class="statistics__title"
            v-html="$t('statistics.titles.distances')"
            ></div>
        </div>

        <div
        class="statistics__content"
        v-loader:blur="{
            loader: dataLoader,
            ignoreError: true,
        }"
        >
            <div class="statistics__items--table">
                <div v-show="false">{{ dataLoader }}</div>

                <table class="statistics__table table--clear">
                    <thead>
                        <tr>
                            <td></td>

                            <td class="td-statistics--fastest-average-pace-for-distance">
                                <div
                                class="data-box__label"
                                v-html="$t('statistics.fastest_average_pace')"
                                ></div>
                            </td>

                            <td class="td-statistics-fastest-time-for-distance">
                                <div
                                class="data-box__label"
                                v-html="$t('statistics.fastest_time')"
                                ></div>
                            </td>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(distance) in distances">
                            <td>
                                <StatisticsItemTitle
                                :name="$t(`type_run_distance.${distance.name}`)"
                                :data="trainingSessionsForDistance(distance.value)"
                                />
                            </td>

                            <td class="td-statistics--fastest-average-pace-for-distance">
                                <StatisticsItem
                                :data="fastestAveragePaceForDistance(distance.value)"
                                />
                            </td>

                            <td class="td-statistics-fastest-time-for-distance">
                                <StatisticsItem
                                :data="fastestTimeForDistance(distance.value)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div
    v-if="shoes"
    class="statistics statistics--shoes"
    >
        <div class="statistics__header">
            <div
            class="statistics__title"
            v-html="$t('statistics.titles.shoes')"
            ></div>
        </div>

        <div
        class="statistics__content"
        v-loader:blur="{
            loader: [dataLoader, shoesLoader],
            ignoreError: true,
        }">
            <div class="statistics__items--table">
                <div v-show="false">{{ dataLoader }}</div>

                <table class="statistics__table table--clear">
                    <thead>
                        <tr>
                            <td></td>

                            <td class="td-statistics--total-distance-for-shoes">
                                <div
                                class="data-box__label"
                                v-html="$t('statistics.total_distance')"
                                ></div>
                            </td>

                            <td class="td-statistics-wear">
                                <div
                                class="data-box__label"
                                v-html="$t('statistics.wear')"
                                ></div>
                            </td>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                        v-for="(shoe) in shoes"
                        :class="!shoe.isUsed ? 'statistics__table-not-used' : null"
                        >
                            <td
                            v-tooltip
                            :title="!shoe.isUsed ? $t('statistics.shoes.withdrawn_from_use') : null"
                            data-bs-trigger="hover"
                            >
                                <StatisticsItemTitle
                                :name="shoe.name"
                                :data="trainingSessionsForShoes(shoe.count)"
                                />
                            </td>

                            <td class="td-statistics--total-distance-for-shoes">
                                <StatisticsItem
                                :data="totalDistanceForShoes(shoe.id)"
                                />
                            </td>

                            <td class="td-statistics-wear">
                                <StatisticsItem
                                :data="wearForShoes(shoe)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import 'moment-duration-format'
import moment from 'moment'

import StatisticsItem from '~/components/Core/StatisticsItem.vue'
import StatisticsItemTitle from '~/components/Core/StatisticsItemTitle.vue'

export default {
    components: {
        StatisticsItem, StatisticsItemTitle
    },
    props: {
        title: {
            type: String,
            default: null,
            required: true
        },
        config: {
            type: Object,
            default: null,
            required: true
        },
        data: {
            type: Array,
            default: null,
            required: true
        },
        dataLoader: {
            type: Object,
            default: () => ({})
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
        },
        shoesLoader: {
            type: Object,
            default: () => ({})
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
            if (!this.data || this.data.length === 0) {
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
            if (!this.data || this.data.length === 0) {
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
        fastestAveragePace() {
            if (!this.data || this.data.length === 0) {
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
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'cm'
            }

            const totalStrideLength = this.data.reduce((acc, activity) => acc + activity.stride_length, 0)

            result.value = (totalStrideLength / this.data.length).toFixed(2)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalStrideLengthPrevious = this.dataPrevious.reduce((acc, activity) => acc + activity.stride_length, 0)

                result.valuePrevious = (totalStrideLengthPrevious / this.dataPrevious.length).toFixed(2)
            }

            return result
        },
        averageVO2Max() {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {}

            const totalVO2Max = this.data.reduce((acc, activity) => acc + activity.v02max, 0)

            result.value = (totalVO2Max / this.data.length).toFixed(2)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalVO2MaxPrevious = this.dataPrevious.reduce((acc, activity) => acc + activity.v02max, 0)

                result.valuePrevious = (totalVO2MaxPrevious / this.dataPrevious.length).toFixed(2)
            }

            return result
        },
        averageCadence() {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {}

            const totalCadence = this.data.reduce((acc, activity) => acc + parseInt(activity.cadence || 0), 0)

            result.value = (totalCadence / this.data.length).toFixed(2)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalCadencePrevious = this.dataPrevious.reduce((acc, activity) => acc + parseInt(activity.cadence || 0), 0)

                result.valuePrevious = (totalCadencePrevious / this.dataPrevious.length).toFixed(2)
            }

            return result
        },
        averageHeartRate() {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {}

            const totalHeartRate = this.data.reduce((acc, activity) => acc + activity.average_heart_rate, 0)

            result.value = (totalHeartRate / this.data.length).toFixed(2)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalHeartRatePrevious = this.dataPrevious.reduce((acc, activity) => acc + activity.average_heart_rate, 0)

                result.valuePrevious = (totalHeartRatePrevious / this.dataPrevious.length).toFixed(2)
            }

            return result
        },
        averageSpeed() {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'km/h'
            }

            const totalSpeed = this.data.reduce((acc, activity) => acc + parseFloat(activity.average_speed), 0)

            result.value = (totalSpeed / this.data.length).toFixed(2)

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalSpeedPrevious = this.dataPrevious.reduce((acc, activity) => acc + parseFloat(activity.average_speed), 0)

                result.valuePrevious = (totalSpeedPrevious / this.dataPrevious.length).toFixed(2)
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
        trainingSessionsForDistance(minDistance) {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {}

            // filter runs above minimum distance
            const runsAboveMinDistance = this.data.filter(entry => entry.distance > minDistance)

            if (runsAboveMinDistance.length === 0) {
                return result
            }

            result.value = runsAboveMinDistance.length

            return result
        },
        fastestAveragePaceForDistance(minDistance) {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'min/km'
            }

            // filter runs above minimum distance
            const runsAboveMinDistance = this.data.filter(entry => entry.distance > minDistance)

            if (runsAboveMinDistance.length === 0) {
                return result
            }

            // find fastest average pace for runs over the minimum distance
            const fastestPace = runsAboveMinDistance.reduce((minPace, entry) => {
                const paceInSeconds = moment.duration(entry.average_pace).asSeconds()
                const minPaceInSeconds = moment.duration(minPace).asSeconds()

                return paceInSeconds < minPaceInSeconds ? entry.average_pace : minPace
            }, runsAboveMinDistance[0].average_pace)

            result.value = fastestPace

            return result
        },
        fastestTimeForDistance(minDistance) {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {}

            // filter runs above minimum distance
            const runsAboveMinDistance = this.data.filter(entry => entry.distance > minDistance)

            if (runsAboveMinDistance.length === 0) {
                return result
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

            result.value = formattedTime

            return result
        },
        trainingSessionsForShoes(count) {
            if (!this.shoes || this.shoes.length === 0) {
                return null
            }

            const result = {}

            if (count !== undefined) {
                result.value = count
            }

            return result
        },
        totalDistanceForShoes(shoeId) {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {
                unit: 'km'
            }

            let totalDistance = null

            this.data.forEach((item) => {
                if (item.shoe === shoeId) {
                    totalDistance += item.distance
                }
            })

            result.value = (totalDistance / 1000).toFixed(2)

            return result
        },
        wearForShoes(shoe) {
            if (!this.data || this.data.length === 0) {
                return null
            }

            const result = {
                unit: '%'
            }

            const maxDistance = 1000

            const totalDistance = this.totalDistanceForShoes(shoe.id).value

            if (totalDistance >= maxDistance) {
                result.value = 100
            }

            const completedDistance = Math.min(totalDistance, maxDistance)

            let totalUsage = (completedDistance / maxDistance) * 100

            totalUsage = Math.min(100, totalUsage).toFixed(0)

            result.value = totalUsage

            return result
        }
    }
}
</script>
