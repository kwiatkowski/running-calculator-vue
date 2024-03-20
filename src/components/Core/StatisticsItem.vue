<template @click.stop>
    <div class="data-box">
        <div
        v-if="label"
        class="data-box__label"
        v-html="$t(`statistics.${camelToSnake(label)}`)"
        ></div>

        <div
        class="data-box__value-wrap"
        v-tooltip
        :title="getTooltip"
        data-bs-trigger="hover"
        data-bs-html="true"
        >
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
            v-if="showDifference && data && data.difference && data.difference.percent"
            :class="[
                'data-box__previous',
                data.isProgress ? 'progress' : null,
                data.isProgress === false ? 'regress' : null
            ]"
            v-html="(data.difference.percent > 0 ? '+' : '') + data.difference.percent + '%'"
            ></div>
        </div>
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
        getTooltip() {
            if (this.data && this.data.difference && this.data.difference.percent !== 0) {
                let displayString = this.data.difference.display

                if (this.data.unit) {
                    displayString += ' ' + this.data.unit
                }

                return displayString
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
