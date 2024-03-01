<template>
    <div class="content">
        <div>Trzy ostatnie biegi sprawdzające lub zawody dla wybranego dystansu:</div>

        <table class="list__table">
            <thead v-if="listColumns !== null && listColumns.length > 0">
                <tr>
                    <th
                    v-for="(column, index) in listColumns"
                    :key="index"
                    :class="'calc-th--' + column.name"
                    v-text="$t('calc.list.columns.' + column.name)"
                    ></th>
                </tr>
            </thead>

            <tbody v-if="getLastThreeVerificationRuns !== null">
                <ListItem
                v-if="getLastThreeVerificationRuns"
                v-for="(item, itemIndex) in getLastThreeVerificationRuns"
                :key="itemIndex"
                :item="item"
                :index="itemIndex"
                />
            </tbody>
        </table>

        <div class="section__title">1. Kalkulator tempa biegu</div>

        <div>
            <p>Wykorzystaj Kalkulator Tempa Biegu, aby precyzyjnie określić tempo, jakie musisz utrzymywać podczas biegu, aby osiągnąć zamierzony wynik na wybranym dystansie.</p>

            <form @submit.prevent="calculatePace">
                <div class="form__row">
                    <label for="distance">Dystans (w kilometrach): </label>
                    <Multiselect
                    v-if="distanceOptions"
                    class="multiselect--inline multiselect--pad-left"
                    v-model="selectedDistance"
                    :options="distanceOptions"
                    :canClear="false"
                    :canDeselect="false"
                    />
                </div>

                <label>Planowany wynik</label>

                <div class="form__row">
                    <Multiselect
                    v-if="hoursOptions"
                    class="multiselect--inline multiselect--pad-left"
                    v-model="selectedHour"
                    :options="hoursOptions"
                    :canClear="false"
                    :canDeselect="false"
                    />
                    godz

                    <Multiselect
                    v-if="minutesOptions"
                    class="multiselect--inline multiselect--pad-left"
                    v-model="selectedMinutes"
                    :options="minutesOptions"
                    :canClear="false"
                    :canDeselect="false"
                    />
                    min

                    <Multiselect
                    v-if="secondsOptions"
                    class="multiselect--inline multiselect--pad-left"
                    v-model="selectedSeconds"
                    :options="minutesOptions"
                    :canClear="false"
                    :canDeselect="false"
                    />
                    sek
                </div>
            </form>

            <div>
                Twoje tempo biegu wynosi:
                <strong v-html="result ? result : '-'"></strong>
            </div>
        </div>

        <!--
        <div class="section__title">2. Episode Time Calculator</div>
        -->
    </div>
</template>

<script>
import { mapState } from 'vuex'

import moment from 'moment'

import ListItem from '~/components/List/ListItem.vue'

export default {
    components: {
        ListItem
    },
    data() {
        return {
            distanceOptions: [1000, 5000, 10000, 15000, 21097, 42195],
            hoursOptions: [],
            minutesOptions: [],
            secondsOptions: [],
            selectedDistance: null,
            selectedHour: null,
            selectedMinutes: null,
            selectedSeconds: null,
            result: null
        }
    },
    watch: {
        selectedDistance() {
            this.calculatePace()
        },
        selectedHour() {
            this.calculatePace()
        },
        selectedMinutes() {
            this.calculatePace()
        },
        selectedSeconds() {
            this.calculatePace()
        },
        getLastThreeVerificationRuns: {
            handler(newRuns, oldRuns) {
                if (newRuns.length >= 3) {
                    const lastRun = moment.duration(newRuns[0].duration)
                    const secondLastRun = moment.duration(newRuns[1].duration)

                    const timeDifferenceInSeconds = secondLastRun.asSeconds() - lastRun.asSeconds()

                    const updatedLastRun = lastRun.subtract(timeDifferenceInSeconds, 'seconds')

                    this.selectedHour = Math.floor(updatedLastRun.asHours())
                    this.selectedMinutes = Math.floor(updatedLastRun.minutes())
                    this.selectedSeconds = Math.floor(updatedLastRun.seconds())
                }
            },
            immediate: true
        }
    },
    computed: {
        ...mapState('training', [
            'list', 'listColumns'
        ]),
        getLastThreeVerificationRuns() {
            const filteredData = this.list
                .filter(item => (item.type === 'verification' || item.type === 'competition') && (!this.selectedDistance || item.distance > this.selectedDistance))
                .sort((a, b) => new Date(b.date) - new Date(a.date))

            return filteredData.slice(0, 3)
        }
    },
    methods: {
        calculatePace() {
            if (this.selectedDistance && (this.selectedHour || this.selectedMinutes || this.selectedSeconds)) {
                const totalMinutes = (parseInt(this.selectedHour) * 60) + parseInt(this.selectedMinutes) + (parseInt(this.selectedSeconds) / 60)
                const pace = totalMinutes / this.selectedDistance * 1000

                const paceMinutes = Math.floor(pace)
                const paceSeconds = Math.round(pace * 60) % 60

                this.result = `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} min/km`
            }
        }
    },
    mounted() {
        for (let i = 0; i < 24; i++) {
            this.hoursOptions.push(i)
        }

        for (let i = 0; i < 60; i++) {
            this.minutesOptions.push(i)
            this.secondsOptions.push(i)
        }

        this.selectedDistance = 10000
        this.selectedHour = 0
        this.selectedMinutes = 0
        this.selectedSeconds = 0
    }
}
</script>
