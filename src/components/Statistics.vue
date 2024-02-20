<template>
    <div class="app__sidebar">
        <div class="statistics">
            <div
            class="section__title"
            v-html="$t('statistics.title')"
            ></div>

            <div class="statistics__item">
                {{ $t('statistics.count_training_sessions') }}: <strong>{{ getCountTrainingSessions() }}</strong>
            </div>

            <div class="statistics__item">
                {{ $t('statistics.longest_distance') }}: <strong>{{ getLongestDistance() }}</strong>
            </div>

            <div class="statistics__item">
                {{ $t('statistics.fastest_average_pace') }}: <strong>{{ getFastestAveragePace() }}</strong>
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
    methods: {
        getCountTrainingSessions() {
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            return `${this.list.length}`
        },
        getLongestDistance() {
            if (!this.list || this.list.length === 0) {
                return '-'
            }

            const maxDistance = Math.max(...this.list.map(entry => entry.distance))

            return `${maxDistance} m`
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
        }
    }
}
</script>