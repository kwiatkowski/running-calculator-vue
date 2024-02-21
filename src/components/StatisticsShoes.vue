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
            <div class="statistics__item">
                Ilość treningów: <strong>{{ shoe.count }}</strong>
            </div>

            <div class="statistics__item">
                Całkowity dystans: <strong>{{ $filters.formatDistance(getTrainingShoeTotalDistance(shoe.id), 'km', true) }} </strong>
            </div>

            <div class="statistics__item">
                Zużycie: <strong>{{ getTrainingShoeUsagePercentage(shoe.id, true) }}</strong>
            </div>
        </div>

        {{  }}
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

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
        ...mapActions('training/shoes', [
            'getTrainingShoes'
        ]),
        getTrainingShoeTotalDistance(shoeId) {
            let totalDistance = null

            this.list.forEach((activity) => {
                if (activity.training_shoes.includes(shoeId)) {
                    totalDistance += activity.distance
                }
            })

            return totalDistance
        },
        getTrainingShoeUsagePercentage(shoeId, withUnit = false) {
            if (withUnit && (!this.list || this.list.length === 0)) {
                return '-'
            }

            const maxDistance = 800

            const totalDistance = this.$filters.formatDistance(this.getTrainingShoeTotalDistance(shoeId), 'km')

            if (totalDistance >= maxDistance) {
                return 100
            }

            const completedDistance = Math.min(totalDistance, maxDistance)

            let totalUsage = (completedDistance / maxDistance) * 100

            return Math.min(100, totalUsage).toFixed(0)

            return withUnit ? `${totalUsage} %` : totalUsage
        }
    },
    mounted() {
        this.getTrainingShoes({})
    }
}
</script>