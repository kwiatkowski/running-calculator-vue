<template>
    <div class="content">
        <div class="form__row">
            {{ $t('plan_run.text_last') }}

            <Multiselect
            v-if="distanceOptions"
            class="multiselect--inline"
            v-model="selectedDistance"
            :options="distanceOptions"
            :canClear="false"
            :canDeselect="false"
            :disabled="listLoader && listLoader.isLoading"
            />
            m
        </div>
    </div>

    <ListTable
    :loader="listLoader"
    :columns="listColumns"
    :data="lastThreeVerificationRuns"
    :dataPreviousItemShow="true"
    />

    <div class="content">
        <div class="section__title">1. {{ $t('plan_run.calculate_pace.title') }}</div>

        <p>{{ $t('plan_run.calculate_pace.text') }}</p>

        <div class="form__row">
            <label class="form__label">{{ $t('plan_run.calculate_pace.planned_time') }}</label>

            <Multiselect
            v-if="hoursOptions"
            class="multiselect--inline"
            v-model="selectedHour"
            :options="hoursOptions"
            :canClear="false"
            :canDeselect="false"
            :disabled="listLoader && listLoader.isLoading"
            />
            godz

            <Multiselect
            v-if="minutesOptions"
            class="multiselect--inline"
            v-model="selectedMinutes"
            :options="minutesOptions"
            :canClear="false"
            :canDeselect="false"
            :disabled="listLoader && listLoader.isLoading"
            />
            min

            <Multiselect
            v-if="secondsOptions"
            class="multiselect--inline"
            v-model="selectedSeconds"
            :options="minutesOptions"
            :canClear="false"
            :canDeselect="false"
            :disabled="listLoader && listLoader.isLoading"
            />
            sek
        </div>

        <div class="form__row mt2">
            {{ $t('plan_run.calculate_pace.running_pace') }}

            <strong v-html="result ? result : '-'"></strong>
        </div>

        <!--
        <div class="section__title">2. Episode Time Calculator</div>
        -->
    </div>
</template>

<script>
import { mapState } from 'vuex'

import moment from 'moment'

import ListTable from '~/components/List/ListTable.vue'

export default {
    components: {
        ListTable
    },
    data() {
        return {
            distanceOptions: [1000, 5000, 10000, 15000, 21097, 42195],
            hoursOptions: Array.from({ length: 24 }, (_, i) => i),
            minutesOptions: Array.from({ length: 60 }, (_, i) => i),
            secondsOptions: Array.from({ length: 60 }, (_, i) => i),
            selectedDistance: null,
            selectedHour: null,
            selectedMinutes: null,
            selectedSeconds: null,
            result: null,
            lastThreeVerificationRuns: []
        }
    },
    watch: {
        list() {
            this.getLastVerificationRuns()
        },
        selectedDistance() {
            this.calculatePace()
            this.getLastVerificationRuns()
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
        lastThreeVerificationRuns() {
            this.plannedResult()
        }
    },
    computed: {
        ...mapState('training', [
            'listLoader', 'list', 'listColumns'
        ])
    },
    methods: {
        getLastVerificationRuns() {
            const filteredList = this.list
                .filter(item => (item.type === 'verification' || item.type === 'competition') && (!this.selectedDistance || item.distance >= this.selectedDistance))
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3)

            this.lastThreeVerificationRuns = filteredList
        },
        plannedResult() {
            if (this.lastThreeVerificationRuns.length >= 3) {
                const lastRun = moment.duration(this.lastThreeVerificationRuns[0].duration)
                const secondLastRun = moment.duration(this.lastThreeVerificationRuns[1].duration)

                const timeDifferenceInSeconds = secondLastRun.asSeconds() - lastRun.asSeconds()

                const updatedLastRun = lastRun.subtract(timeDifferenceInSeconds, 'seconds')

                this.selectedHour = Math.floor(updatedLastRun.asHours())
                this.selectedMinutes = Math.floor(updatedLastRun.minutes())
                this.selectedSeconds = Math.floor(updatedLastRun.seconds())
            }
        },
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
        this.selectedDistance = 10000

        this.getLastVerificationRuns()
    }
}
</script>
