<template>
    <div
    :class="[
        'statistics__item',
        !label ? 'statistics__item--inline': null
    ]"
    @click.stop
    >
        <span
        v-if="label"
        class="statistics__label"
        v-html="$t(`statistics.${camelToSnake(label)}`) + ': '"
        ></span>

        <span
        class="statistics__value"
        v-html="data && data.value ? (data.value && data.valueDisplay ? data.valueDisplay : data.value) : '-'"
        ></span>

        <span
        v-if="data && data.value && data.unit"
        class="statistics__unit"
        v-html="data.unit"
        ></span>

        <span
        v-if="showDifference && percentageDifference != null"
        :class="[
            'statistics__previous',
            'percent',
            percentageDifference > 0 ? 'percent--increase' : null,
            percentageDifference < 0 ? 'percent--decrease' : null
        ]"
        v-html="(percentageDifference > 0 ? '+' : '') + percentageDifference + '%'"
        ></span>
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
