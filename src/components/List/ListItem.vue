<template>
    <tr :key="index">
        <td
        class="list-td--ord"
        v-html="getOrd(index)"
        ></td>

        <td class="list-td--date_run">
            <Value
            :data="getDate"
            :tooltipValue="true"
            :tooltipValueCustom="'getDate'"
            />
        </td>

        <td
        class="list-td--type"
        v-html="$t('calc.type.' + item.type)"
        ></td>

        <td
        class="list-td--distance"
        v-html="$filters.formatDistance(item.distance, 'km')"
        ></td>

        <td class="list-td--duration">
            <Value
            :data="getDuration"
            :valueColor="true"
            :showUnit="false"
            :progressReverse="true"
            :tooltipPercent="true"
            :tooltipValue="true"
            :tooltipValueCustom="'getDuration'"
            />
        </td>

        <td class="list-td--stride_length">
            <Value
            :data="getStrideLength"
            :valueColor="true"
            :showUnit="false"
            :tooltipPercent="true"
            :tooltipValue="true"
            />
        </td>

        <td class="list-td--cadence">
            <Value
            :data="getCadence"
            :valueColor="true"
            :showUnit="false"
            :tooltipPercent="true"
            :tooltipValue="true"
            />
        </td>

        <td class="list-td--average_heart_rate">
            <Value
            :data="getAverageHeartRate"
            :valueColor="true"
            :showUnit="false"
            :tooltipPercent="true"
            :tooltipValue="true"
            />
        </td>

        <td class="list-td--v02max">
            <Value
            :data="getV02max"
            :valueColor="true"
            :showUnit="false"
            :tooltipPercent="true"
            :tooltipValue="true"
            />
        </td>

        <td class="list-td--average_pace">
            <Value
            :data="getAveragePace"
            :valueColor="true"
            :showUnit="false"
            :progressReverse="true"
            :tooltipPercent="true"
            :tooltipValue="true"
            :tooltipValueCustom="'getAveragePace'"
            />
        </td>

        <td class="list-td--average_speed">
            <Value
            :data="getAverageSpeed"
            :valueColor="true"
            :showUnit="false"
            :tooltipPercent="true"
            :tooltipValue="true"
            />
        </td>
    </tr>
</template>

<script>
import Value from '~/components/Core/Value.vue'

export default {
    components: {
        Value
    },
    props: {
        index: {
            type: Number,
            default: null
        },
        item: {
            type: Object,
            default: null
        },
        itemPrevious: {
            type: Object,
            default: null
        },
        itemPreviousShow: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        getOrd() {
            return (index) => index + 1
        },
        getDate() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                current: {
                    value: new Date(this.item.date),
                    display: this.$formatDate(this.item.date)
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.stride_length) {
                result.previous = {
                    value: new Date(this.itemPrevious.date),
                    display: this.$formatDate(this.itemPrevious.date)
                }
            }

            return result
        },
        getDuration() {
            if (!this.item || !this.item.duration) {
                return null;
            }

            const current = this.item.duration.split(":").map(part => parseInt(part))
            const currentSeconds = (current[0] * 60 * 60) + (current[1] * 60) + current[2]

            const result = {
                current: {
                    value: currentSeconds,
                    display: this.item.duration
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.duration) {
                const previous = this.itemPrevious.duration.split(":").map(part => parseInt(part))
                const previousSeconds = (previous[0] * 60 * 60) + (previous[1] * 60) + previous[2]

                result.previous = {
                    value: previousSeconds,
                    display: this.item.duration
                }
            }

            return result
        },
        getStrideLength() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                unit: 'cm',
                current: {
                    value: parseFloat(this.item.stride_length)
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.stride_length) {
                result.previous = {
                    value: parseFloat(this.itemPrevious.stride_length)
                }
            }

            return result
        },
        getCadence() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                current: {
                    value: parseFloat(this.item.cadence)
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.cadence) {
                result.previous = {
                    value: parseFloat(this.itemPrevious.cadence)
                }
            }

            return result
        },
        getAverageHeartRate() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                current: {
                    value: parseFloat(this.item.average_heart_rate)
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.average_heart_rate) {
                result.previous = {
                    value: parseFloat(this.itemPrevious.average_heart_rate)
                }
            }

            return result
        },
        getV02max() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                current: {
                    value: parseFloat(this.item.v02max)
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.v02max) {
                result.previous = {
                    value: parseFloat(this.itemPrevious.v02max)
                }
            }

            return result
        },
        getAveragePace() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                unit: 'min/km',
            }

            const current = this.item.average_pace.split(":").map(part => parseInt(part))
            const currentSeconds = current[0] * 60 + current[1]

            result.current = {
                value: currentSeconds,
                display: this.item.average_pace
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.average_pace) {
                const previous = this.itemPrevious.average_pace.split(":").map(part => parseInt(part))
                const previousSeconds = previous[0] * 60 + previous[1]

                result.previous = {
                    value: previousSeconds,
                    display: this.itemPrevious.average_pace
                }
            }

            return result
        },
        getAverageSpeed() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                unit: 'km/h',
                current: {
                    value: parseFloat(this.item.average_speed)
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.average_speed) {
                result.previous = {
                    value: parseFloat(this.itemPrevious.average_speed)
                }
            }

            return result
        }
    }
}
</script>
