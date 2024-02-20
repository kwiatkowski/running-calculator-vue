<template>
    <div class="app__sidebar">
        <div class="statistics statistics--sidebar">
            <div
            class="section__title"
            v-html="$t('statistics.title')"
            ></div>

            <div class="statistics__item">
                {{ $t('statistics.count_training_sessions') }}: <strong>{{ getCountTrainingSessions() }}</strong>
            </div>

            <div class="statistics__item">
                {{ $t('statistics.total_distance') }}: <strong>{{ getTotalDistance() }}</strong>
            </div>

            <div class="statistics__item">
                {{ $t('statistics.longest_distance') }}: <strong>{{ getLongestDistance() }}</strong>
            </div>

            <div class="statistics__item">
                {{ $t('statistics.fastest_average_pace') }}: <strong>{{ getFastestAveragePace() }}</strong>
            </div>

            <div
            class="statistics__item-separator"
            v-for="distance in distances"
            :key="distance">
                <strong>{{ $t(`type_run_distance.${distance.name}`) }}</strong> ({{ getCountTrainingSessionsForDistance(distance.value) }})

                <div class="statistics__item">
                    {{ $t('statistics.fastest_average_pace') }}: <strong>{{ getFastestAveragePaceForDistance(distance.value) }}</strong>
                </div>

                <div class="statistics__item">
                    {{ $t('statistics.fastest_time') }}: <strong>{{ getTimeToRunForDistance(distance.value) }}</strong>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    props: {
        loader: {
            type: Object,
            default: null
        },
        list: {
            type: Array,
            default: null
        }
    },
    computed: {
        distances() {
            return [
                {
                    name: '10km',
                    value: 10000
                },
                {
                    name: 'half_marathon',
                    value: 21097
                },
                {
                    name: 'marathon',
                    value: 42195
                }
            ]
        },
    },
    methods: {
        getCountTrainingSessions() {
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            return `${this.list.length}`
        },
        getCountTrainingSessionsForDistance(minDistance) {
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            // filter runs above minimum distance
            const runsAboveMinDistance = this.list.filter(entry => entry.distance > minDistance)

            if (runsAboveMinDistance.length === 0) {
                return '-'
            }

            return `${runsAboveMinDistance.length}`
        },
        getTotalDistance() {
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            const totalDistanceInMeters = this.list.reduce((sum, entry) => sum + entry.distance, 0)
            const totalDistanceInKm = totalDistanceInMeters / 1000

            return `${totalDistanceInKm} km`
        },
        getLongestDistance() {
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            const maxDistance = Math.max(...this.list.map(entry => entry.distance)) / 1000

            return `${maxDistance} km`
        },
        getFastestAveragePace() {
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            const fastestPace = this.list.reduce((minPace, entry) => {
                const paceInSeconds = moment.duration(entry.average_pace).asSeconds()
                const minPaceInSeconds = moment.duration(minPace).asSeconds()

                return paceInSeconds < minPaceInSeconds ? entry.average_pace : minPace
            }, this.list[0].average_pace)

            return `${fastestPace}`
        },
        getFastestAveragePaceForDistance(minDistance) {
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            // filter runs above minimum distance
            const runsAboveMinDistance = this.list.filter(entry => entry.distance > minDistance)

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
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            // filter runs above minimum distance
            const runsAboveMinDistance = this.list.filter(entry => entry.distance > minDistance)

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
        }
    }
}
</script>