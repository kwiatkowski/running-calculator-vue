<template @click.stop>
    <div class="data-box">
        <div
        v-if="label"
        class="data-box__label"
        v-html="$t(`statistics.${camelToSnake(label)}`)"
        ></div>

        <div
        class="data-box__value"
        v-html="data && data.value ? (data.value && data.valueDisplay ? data.valueDisplay : data.value) : '-'"
        ></div>

        <div
        v-if="data && data.value && data.unit"
        class="data-box__unit"
        v-html="data.unit"
        ></div>

        <div
        v-if="showDifference && percentageDifference != null"
        :class="[
            'data-box__previous',
            'percent',
            percentageDifference > 0 ? 'percent--increase' : null,
            percentageDifference < 0 ? 'percent--decrease' : null
        ]"
        v-html="(percentageDifference > 0 ? '+' : '') + percentageDifference + '%'"
        ></div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: null
        },
        data: {
            type: Object,
            default: null
        },
        showDifference: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        percentageDifference() {
            if (this.data && this.data.valuePrevious != null) {
                const previous = this.data.valuePrevious
                const current = this.data.value

                if (previous === 0) {
                    return 100
                }

                const result = (((current - previous) / previous) * 100).toFixed(2)

                return result === '0.00' ? 0 : result
            } else {
                return null
            }
        }
    },
    methods: {
        camelToSnake(str) {
            if (typeof str !== 'string') {
                return str
            }

            return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
        }
    }
}
</script>
