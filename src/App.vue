<template>
    <div class="app app--vue">
        <div class="app__header">
            <nav class="app__nav">
                <router-link
                to="/training/"
                class="app__nav-link"
                v-html="$t('calc.navigation.list')"
                ></router-link>

                <!--
                <router-link
                to="/training/charts"
                class="app__nav-link"
                v-html="$t('calc.navigation.charts')"
                ></router-link>
                -->

                <router-link
                to="/training/plan-run"
                class="app__nav-link"
                v-html="$t('calc.navigation.plan_run')"
                ></router-link>
            </nav>
        </div>

        <div class="app__content">
            <router-view></router-view>
        </div>

        <div class="app__sidebar">
            <Statistics
            :title="$t('statistics.titles.general')"
            :config="{
                isExpandable: false,
                isExpand: false,
                basic: ['trainingSessions', 'totalDistance', 'longestDistance', 'totalDuration', 'fastestAveragePace'],
                advanced: ['averageStrideLength', 'averageVO2Max', 'averageCadence', 'averageHeartRate', 'averageSpeed'],
            }"
            :data="list"
            :distances="distances"
            :shoes="shoes"
            />
        </div>

        <div class="app__footer">
            v{{ appVersion }}
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Statistics from '~/components/Core/Statistics.vue'

export default {
    components: {
        Statistics
    },
    data() {
        return {
            appVersion: process.env.VUE_APP_VERSION
        }
    },
    computed: {
        ...mapState('training/shoes', [
            'shoes'
        ]),
        ...mapState('training', [
            'list', 'distances'
        ])
    },
    methods: {
        ...mapActions('training', [
            'getListCalc'
        ]),
        ...mapActions('training/shoes', [
            'getTrainingShoes'
        ]),
        init() {
            this.getTrainingShoes({})
            this.getListCalc({})
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 14px;
}
</style>
