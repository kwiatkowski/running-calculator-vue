<template>
    <div class="statistics statistics--sidebar">
        <div
        class="section__title"
        v-html="'Buty'"
        ></div>

        <div
        class="statistics__item-separator"
        v-for="(shoe, shoeIndex) in shoes"
        :key="shoeIndex"
        >
            <strong>{{ shoe.name }}</strong>

            <div class="statistics__item">
                {{ $t('statistics.count_training_sessions') }}: <strong>{{ getTrainingCount(shoe.count) }}</strong>
            </div>

            <div class="statistics__item">
                {{ $t('statistics.total_distance') }}: <strong>{{ $filters.formatDistance(getTotalDistance(shoe.id), 'km', true) }}</strong>
            </div>

            <div class="statistics__item">
                {{ $t('statistics.wear') }}: <strong>{{ getUsagePercentage(shoe, true) }}</strong>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

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
        ...mapState('training/shoes', [
            'shoes'
        ])
    },
    methods: {
        getTrainingCount(count) {
            if (!this.shoes || this.shoes.length === 0 || count === 0) {
                return '-'
            }

            return count
        },
        getTotalDistance(shoeId) {
            let totalDistance = null

            this.list.forEach((item) => {
                if (item.shoe === shoeId) {
                    totalDistance += item.distance
                }
            })

            return totalDistance
        },
        getUsagePercentage(shoe, withUnit = false) {
            if (withUnit && (!this.list || this.list.length === 0 || shoe.count === 0)) {
                return '-'
            }

            const maxDistance = 800

            const totalDistance = this.$filters.formatDistance(this.getTotalDistance(shoe.id), 'km')

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