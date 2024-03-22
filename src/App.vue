<template>
    <div class="app app--vue">
        <div class="app__header">
            <Menu />
        </div>

        <div class="app__content">
            <router-view />
        </div>

        <div class="app__sidebar">
            <Statistics
            :title="$t('statistics.titles.general')"
            :config="{
                isExpandable: false,
                isExpand: false,
                basic: ['trainingSessions', 'totalDuration', 'totalDistance', 'longestDistance', 'fastestAveragePace'],
                advanced: ['averageSpeed', 'averageStrideLength', 'averageHeartRate', 'averageCadence', 'averageVO2Max'],
            }"
            :data="list"
            :dataLoader="listLoader"
            :distances="distances"
            :shoes="shoes"
            :shoesLoader="shoesLoader"
            />

            <div class="app__version">
                v{{ appVersion }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Menu from '~/components/Partials/Menu.vue'
import Statistics from '~/components/Core/Statistics.vue'
import Value from '~/components/Core/Value.vue'

export default {
    components: {
        Menu, Statistics, Value
    },
    data() {
        return {
            appVersion: process.env.VUE_APP_VERSION
        }
    },
    computed: {
        ...mapState('training/shoes', [
            'shoes', 'shoesLoader'
        ]),
        ...mapState('training', [
            'list', 'listLoader', 'distances'
        ])
    },
    methods: {
        ...mapActions('training', [
            'getTrainingList'
        ]),
        ...mapActions('training/shoes', [
            'getTrainingShoes'
        ]),
        init() {
            this.getTrainingShoes()
            this.getTrainingList()
        }
    },
    created() {
        this.init()
    }
}
</script>

<style lang="scss">
.xxx {

}
</style>
