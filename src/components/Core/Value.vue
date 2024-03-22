<template @click.stop>
    <div
    class="data-box"
    >
        <div
        v-if="label"
        class="data-box__label"
        v-html="label"
        ></div>

        <div
        class="data-box__value-wrap"
        v-tooltip
        :title="displayTooltip"
        data-bs-trigger="hover"
        data-bs-html="true"
        >
            <div
            v-if="data && data.current && data.current.value !== null && data.current.value !== undefined"
            :class="{
                'data-box__value': true,
                'progress': valueColor && getProgress() === true,
                'regress': valueColor && getProgress() === false
            }"
            v-html="data.current.display ? data.current.display : data.current.value"
            ></div>

            <div
            v-if="data && data.current && data.current.value !== null && data.current.value !== undefined && showUnit"
            class="data-box__unit"
            v-html="data.unit"
            ></div>

            <div
            v-if="showDifference && data && data.current && data.current.value && data.previous && data.previous.value"
            :class="{
                'data-box__previous': true,
                'progress': getProgress() === true,
                'regress': getProgress() === false,
            }"
            v-html="displayPercent"
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
            default: () => ({}),
            required: true
        },
        valueColor: {
            type: Boolean,
            default: false
        },
        showUnit: {
            type: Boolean,
            default: true
        },
        showDifference: {
            type: Boolean,
            default: false
        },
        progressReverse: {
            type: Boolean,
            default: false
        },
        tooltipPercent: {
            type: Boolean,
            default: false
        },
        tooltipValue: {
            type: Boolean,
            default: false
        },
        tooltipValueCustom: {
            type: String,
            default: null
        }
    },
    computed: {
        displayPercent() {
            if (this.data && this.data.current && this.data.current.value && this.data.previous && this.data.previous.value) {
                const percent = this.getPercent()

                return (percent > 0 ? '+' : '') + percent + '%'
            } else {
                return null
            }
        },
        displayTooltip() {
            if (this.data && this.data.current && this.data.current.value && this.data.previous && this.data.previous.value) {
                let result = ''

                if (this.tooltipValue && (this.data.current.value != this.data.previous.value)) {
                    if (this.tooltipValueCustom && typeof this[this.tooltipValueCustom] === 'function') {
                        result += this[this.tooltipValueCustom]()
                    } else {
                        result += (this.data.current.value - this.data.previous.value) > 0 ? '+' : ''
                        result += (this.data.current.value - this.data.previous.value).toFixed(2)
                        result += (this.data.unit ? ' ' + this.data.unit : '')
                    }
                }

                if (this.tooltipPercent && (this.data.current.value != this.data.previous.value)) {
                    if (this.tooltipValue && (this.data.current.value != this.data.previous.value)) {
                        result += '<br>(' + this.displayPercent + ')'
                    } else {
                        result += this.displayPercent
                    }
                }

                return result
            } else {
                return null
            }
        }
    },
    methods: {
        getPercent() {
            if (this.data && this.data.current && this.data.current.value && this.data.previous && this.data.previous.value) {
                const percent = ((this.data.current.value - this.data.previous.value) / this.data.previous.value) * 100
                const percentFormat = percent.toFixed(2)

                return percentFormat
            } else {
                return null
            }
        },
        getProgress() {
            const percentValue = this.getPercent()

            if (percentValue === null || isNaN(percentValue) || Math.round(percentValue) === 0) {
                return null
            }

            const isProgress = parseFloat(percentValue) > 0

            if (this.progressReverse) {
                return !isProgress
            }

            return isProgress
        },
        getDate() {
            const current = this.data.current.value
            const previous = this.data.previous.value

            const timeDifference = Math.abs(current.getTime() - previous.getTime())
            const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))

            return daysDifference === 1 ? this.$t('plan_run.previous_verification_singular', { count: daysDifference }) : this.$t('plan_run.previous_verification_plural', { count: daysDifference });
        },
        getDuration() {
            const current = this.data.current.value
            const previous = this.data.previous.value

            const diffSeconds = current - previous

            const diffHours = Math.floor(Math.abs(diffSeconds) / 3600)
            const diffMinutes = Math.floor((Math.abs(diffSeconds) % 3600) / 60)
            const diffSecondsRemainder = Math.abs(diffSeconds) % 60

            const diffDisplay = (diffSeconds < 0 ? "-" : "") +  (diffHours < 10 ? "0" : "") + diffHours + ":" +  (diffMinutes < 10 ? "0" : "") + diffMinutes + ":" +  (diffSecondsRemainder < 10 ? "0" : "") + Math.abs(diffSecondsRemainder)

            return diffDisplay
        },
        getAveragePace() {
            const current = this.data.current.display.split(":").map(part => parseInt(part))
            const previous = this.data.previous.display.split(":").map(part => parseInt(part))

            const currentSeconds = current[0] * 60 + current[1]
            const previousSeconds = previous[0] * 60 + previous[1]
            const diffSeconds = currentSeconds - previousSeconds

            const diffMinutes = Math.floor(Math.abs(diffSeconds) / 60)
            const diffSecondsRemainder = Math.abs(diffSeconds) % 60

            const diffDisplay = (diffSeconds < 0 ? "-" : "") + (diffMinutes < 10 ? "0" : "") + diffMinutes + ":" + (diffSecondsRemainder < 10 ? "0" : "") + Math.abs(diffSecondsRemainder)

            return diffDisplay + ' min/km'
        },
        getFastestAveragePace() {
            const diffSeconds = this.data.current.value - this.data.previous.value

            const diffMinutes = Math.floor(Math.abs(diffSeconds) / 60)
            const diffSecondsRemainder = Math.abs(diffSeconds) % 60

            const diffDisplay = (diffSeconds < 0 ? "-" : "") + (diffMinutes < 10 ? "0" : "") + diffMinutes + ":" + (diffSecondsRemainder < 10 ? "0" : "") + Math.abs(diffSecondsRemainder)

            return diffDisplay + ' min/km'
        }
    }
}
</script>
