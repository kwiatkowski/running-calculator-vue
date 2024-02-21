<template>
    <div class="statistics statistics--sidebar">
        <div
        class="section__title"
        v-html="'Buty'"
        ></div>

        <div
        class="statistics__item"
        v-for="(shoe, shoeIndex) in shoes"
        :key="shoeIndex"
        >
            <strong>{{ shoe.name }}</strong>
            <div>Ilość treningów: <strong>{{ shoe.count }}</strong></div>
            <div>Całkowity dystans: <strong>{{ calculateTotalDistance(shoe.id) }} km</strong></div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

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
        ]),
        countShoes() {
            const shoeCounts = {}

            this.list.forEach(activity => {
                const shoeType = activity.shoe

                shoeCounts[shoeType] = (shoeCounts[shoeType] || 0) + 1
            })

            return shoeCounts
        }
    },
    methods: {
        ...mapActions('training/shoes', [
            'getTrainingShoes'
        ]),
        calculateTotalDistance(shoeId) {
            let totalDistance = 0

            this.list.forEach((activity) => {
                if (activity.training_shoes.includes(shoeId)) {
                    totalDistance += activity.distance
                }
            })

            return (totalDistance / 1000).toFixed(1)
        }
    },
    mounted() {
        this.getTrainingShoes({})
    }
}
</script>