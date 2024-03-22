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
                    <Value
                    v-for="(item, itemKey) in config.basic"
                    :key="itemKey"
                    :data="this[item]"
                    :tooltipPercent="true"
                    :tooltipValue="true"
                    :tooltipValueCustom="item === 'fastestAveragePace' ? 'getFastestAveragePace' : null"
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
                        <Value
                        v-for="(item, itemKey) in config.basic"
                        :key="itemKey"
                        :label="$t(`statistics.${camelToSnake(item)}`)"
                        :data="this[item]"
                        :showDifference="true"
                        :progressReverse="item === 'fastestAveragePace' ? true : false"
                        :tooltipValue="true"
                        :tooltipValueCustom="item === 'fastestAveragePace' ? 'getFastestAveragePace' : null"
                        />
                    </div>

                    <div
                    class="statistics__items"
                    v-if="config.advanced"
                    >
                        <Value
                        v-for="(item, itemKey) in config.advanced"
                        :key="itemKey"
                        :label="$t(`statistics.${camelToSnake(item)}`)"
                        :data="this[item]"
                        :showDifference="true"
                        :progressReverse="item === 'averageHeartRate' ? true : false"
                        :tooltipValue="true"
                        />
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
                                <Value
                                :data="fastestAveragePaceForDistance(distance.value)"
                                :showUnit="true"
                                />
                            </td>

                            <td class="td-statistics-fastest-time-for-distance">
                                <Value
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
                                <Value
                                :data="totalDistanceForShoes(shoe.id)"
                                :showUnit="true"
                                />
                            </td>

                            <td class="td-statistics-wear">
                                <Value
                                :data="wearForShoes(shoe)"
                                :showUnit="true"
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

import Value from '~/components/Core/Value.vue'
import StatisticsItemTitle from '~/components/Core/StatisticsItemTitle.vue'

export default {
    components: {
        StatisticsItemTitle, Value
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
                return {
                    current: {
                        value: '-'
                    }
                }
            }

            const result = {
                current: {
                    value: this.data.length
                }
            }

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                result.previous = {
                    value: this.dataPrevious.length
                }
            }

            return result
        },
        totalDuration() {
            if (!this.data || this.data.length === 0) {
                return {
                    current: {
                        value: '-'
                    }
                }
            }

            const result = {
                unit: 'godz.',
                current: {
                    value: this.calculateTotalDuration(this.data)
                }
            }

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                result.previous = {
                    value: this.calculateTotalDuration(this.dataPrevious)
                }
            }

            return result
        },
        totalDistance() {
            if (!this.data || this.data.length === 0) {
                return {
                    current: {
                        value: '-'
                    }
                }
            }

            const result = {
                unit: 'km',
                current: {
                    value: (this.data.reduce((sum, item) => sum + item.distance, 0) / 1000).toFixed(2)
                }
            }

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                result.previous = {
                    value: (this.dataPrevious.reduce((sum, item) => sum + item.distance, 0) / 1000).toFixed(2)
                }
            }

            return result
        },
        longestDistance() {
            if (!this.data || this.data.length === 0) {
                return {
                    current: {
                        value: '-'
                    }
                }
            }

            const result = {
                unit: 'km',
                current: {
                    value: (Math.max(...this.data.map(entry => entry.distance)) / 1000).toFixed(2)
                }
            }

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                result.previous = {
                    value: (Math.max(...this.dataPrevious.map(entry => entry.distance)) / 1000).toFixed(2)
                }
            }

            return result
        },
        fastestAveragePace() {
            if (!this.data || this.data.length === 0) {
                return {
                    current: {
                        value: '-'
                    }
                }
            }

            const result = {
                unit: 'min/km',
                current: {
                    value: (Math.max(...this.data.map(entry => entry.distance)) / 1000).toFixed(2)
                }
            }

            const fastestAveragePace = this.data.reduce((fastest, current) => {
                return current.average_pace < fastest.average_pace ? current : fastest
            })

            const [minutes, seconds] = fastestAveragePace.average_pace.split(':').map(Number)
            const timeInSeconds = minutes * 60 + seconds

            result.current = {
                value: timeInSeconds,
                display: fastestAveragePace.average_pace
            }

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const fastestAveragePacePrevious = this.dataPrevious.reduce((fastest, current) => {
                    return current.average_pace < fastest.average_pace ? current : fastest
                })

                const [minutesPrevious, secondsPrevious] = fastestAveragePacePrevious.average_pace.split(':').map(Number)
                const timeInSecondsPrevious = minutesPrevious * 60 + secondsPrevious

                result.previous = {
                    value: timeInSecondsPrevious,
                    display: fastestAveragePacePrevious.average_pace
                }
            }

            return result
        },
        averageSpeed() {
            return this.calculateMetric(this.data, 'average_speed', 'km/h')
        },
        averageStrideLength() {
            return this.calculateMetric(this.data, 'stride_length', 'cm')
        },
        averageHeartRate() {
            return this.calculateMetric(this.data, 'average_heart_rate')
        },
        averageCadence() {
            return this.calculateMetric(this.data, 'cadence')
        },
        averageVO2Max() {
            return this.calculateMetric(this.data, 'v02max')
        }
    },
    methods: {
        camelToSnake(str) {
            if (typeof str !== 'string') {
                return str
            }

            return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
        },
        clickStatisticsExpandToggle() {
            this.statisticsExpand = !this.statisticsExpand
        },
        calculateMetric(data, key, unit = null) {
            if (!data || data.length === 0) {
                return { current: { value: '-' }, ...(unit && { unit }) }
            }

            const total = data.reduce((acc, activity) => {
                const value = parseFloat(activity[key]) || 0

                return acc + value
            }, 0)

            const average = (total / data.length).toFixed(2)

            const result = { current: { value: average }, ...(unit && { unit }) }

            if (this.dataPrevious && this.dataPrevious.length > 0) {
                const totalPrevious = this.dataPrevious.reduce((acc, activity) => {
                    const value = parseFloat(activity[key]) || 0

                    return acc + value
                }, 0)

                const averagePrevious = (totalPrevious / this.dataPrevious.length).toFixed(2)

                result.previous = { value: averagePrevious }
            }

            return result
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
                return {
                    current: {
                        value: '-'
                    }
                }
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

            return {
                unit: 'min/km',
                current: {
                    value: fastestPace
                }
            }
        },
        fastestTimeForDistance(minDistance) {
            if (!this.data || this.data.length === 0) {
                return {
                    current: {
                        value: '-'
                    }
                }
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

            return {
                current: {
                    value: formattedTime
                }
            }
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
                return {
                    current: {
                        value: '-'
                    }
                }
            }

            const totalDistance = this.data.reduce((acc, item) => {
                if (item.shoe === shoeId) {
                    return acc + item.distance
                } else {
                    return acc
                }
            }, 0)

            const result = {
                unit: 'km',
                current: {
                    value: (totalDistance / 1000).toFixed(2)
                }
            }

            return result
        },
        wearForShoes(shoe) {
            if (!this.data || this.data.length === 0) {
                return {
                    current: {
                        value: '-'
                    }
                }
            }

            const maxDistance = 1000
            const totalDistance = this.totalDistanceForShoes(shoe.id).current.value
            const completedDistance = Math.min(totalDistance, maxDistance)
            const totalUsage = Math.min((completedDistance / maxDistance) * 100, 100)

            const result = {
                unit: '%',
                current: {
                    value: Math.round(totalUsage)
                }
            }

            return result
        }
    }
}
// 850
</script>
