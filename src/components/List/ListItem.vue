<template>
    <tr :key="index">
        <td
        class="list-td--ord"
        v-html="getOrd(index)"
        ></td>

        <td class="list-td--date_run">
            <ListItemValue
            :data="getDate"
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
            <ListItemValue
            :data="getDuration"
            />
        </td>

        <td class="list-td--stride_length">
            <ListItemValue
            :data="getStrideLength"
            />
        </td>

        <td class="list-td--cadence">
            <ListItemValue
            :data="getCadence"
            />
        </td>

        <td class="list-td--average_heart_rate">
            <ListItemValue
            :data="getAverageHeartRate"
            />
        </td>

        <td class="list-td--v02max">
            <ListItemValue
            :data="getV02max"
            />
        </td>

        <td class="list-td--average_pace">
            <ListItemValue
            :data="getAveragePace"
            />
        </td>

        <td class="list-td--average_speed">
            <ListItemValue
            :data="getAverageSpeed"
            />
        </td>
    </tr>
</template>

<script>
import ListItemValue from '~/components/Core/ListItemValue.vue'

export default {
    components: {
        ListItemValue
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
                value: {
                    display: this.$formatDate(this.item.date)
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.date) {
                const difference = {}

                const currentDate = new Date(this.item.date)
                const previousDate = new Date(this.itemPrevious.date)

                const timeDifference = Math.abs(currentDate.getTime() - previousDate.getTime())
                const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))

                difference.display = daysDifference === 1 ? this.$t('plan_run.previous_verification_singular', { count: daysDifference }) : this.$t('plan_run.previous_verification_plural', { count: daysDifference });

                result.difference = difference
            }

            return result
        },
        getDuration() {
            if (!this.item || !this.item.duration) {
                return null;
            }

            const result = {
                value: {
                    display: this.item.duration
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.duration) {
                const difference = {}

                const current = this.item.duration.split(":").map(part => parseInt(part))
                const previous = this.itemPrevious.duration.split(":").map(part => parseInt(part))

                const currentSeconds = (current[0] * 60 * 60) + (current[1] * 60) + current[2]
                const previousSeconds = (previous[0] * 60 * 60) + (previous[1] * 60) + previous[2]
                const diffSeconds = currentSeconds - previousSeconds

                const percentageDifference = (diffSeconds / previousSeconds) * 100

                const diffHours = Math.floor(Math.abs(diffSeconds) / 3600)
                const diffMinutes = Math.floor((Math.abs(diffSeconds) % 3600) / 60)
                const diffSecondsRemainder = Math.abs(diffSeconds) % 60

                const diffDisplay = (diffSeconds < 0 ? "-" : "") +  (diffHours < 10 ? "0" : "") + diffHours + ":" +  (diffMinutes < 10 ? "0" : "") + diffMinutes + ":" +  (diffSecondsRemainder < 10 ? "0" : "") + Math.abs(diffSecondsRemainder)

                difference.percent = percentageDifference.toFixed(2)
                difference.display = diffDisplay

                result.isProgress = percentageDifference >= 0 ? false : true
                result.difference = difference

                if (percentageDifference > 0) {
                    result.isProgress = false
                } else if (percentageDifference < 0) {
                    result.isProgress = true
                }
            }

            return result
        },
        getStrideLength() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                value: {
                    display: this.item.stride_length
                },
                unit: 'cm'
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.stride_length) {
                const difference = {}

                const current = parseFloat(this.item.stride_length)
                const previous = parseFloat(this.itemPrevious.stride_length)

                const percentageDifference = ((current - previous) / previous) * 100

                difference.percent = percentageDifference.toFixed(2)
                difference.display = current - previous

                result.isProgress = percentageDifference <= 0 ? false : true
                result.difference = difference

                if (percentageDifference > 0) {
                    result.isProgress = true
                } else if (percentageDifference < 0) {
                    result.isProgress = false
                }
            }

            return result
        },
        getCadence() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                value: {
                    display: this.item.cadence
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.cadence) {
                const difference = {}

                const current = parseFloat(this.item.cadence)
                const previous = parseFloat(this.itemPrevious.cadence)

                const percentageDifference = ((current - previous) / previous) * 100

                difference.percent = percentageDifference.toFixed(2)
                difference.display = current - previous

                if (percentageDifference > 0) {
                    result.isProgress = true
                } else if (percentageDifference < 0) {
                    result.isProgress = false
                }

                result.difference = difference
            }

            return result
        },
        getV02max() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                value: {
                    display: this.item.v02max
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.v02max) {
                const difference = {}

                const current = parseFloat(this.item.v02max)
                const previous = parseFloat(this.itemPrevious.v02max)

                const percentageDifference = ((current - previous) / previous) * 100

                difference.percent = percentageDifference.toFixed(2)
                difference.display = current - previous

                if (percentageDifference > 0) {
                    result.isProgress = true
                } else if (percentageDifference < 0) {
                    result.isProgress = false
                }

                result.difference = difference
            }

            return result
        },
        getAverageHeartRate() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                value: {
                    display: this.item.average_heart_rate
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.average_heart_rate) {
                const difference = {}

                const current = parseFloat(this.item.average_heart_rate)
                const previous = parseFloat(this.itemPrevious.average_heart_rate)

                const percentageDifference = ((current - previous) / previous) * 100

                difference.percent = percentageDifference.toFixed(2)
                difference.display = current - previous

                if (percentageDifference > 0) {
                    result.isProgress = false
                } else if (percentageDifference < 0) {
                    result.isProgress = true
                }

                result.difference = difference
            }

            return result
        },
        getAveragePace() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                value: {
                    display: this.item.average_pace
                }
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.average_pace) {
                const difference = {}

                const current = this.item.average_pace.split(":").map(part => parseInt(part))
                const previous = this.itemPrevious.average_pace.split(":").map(part => parseInt(part))

                const currentSeconds = current[0] * 60 + current[1]
                const previousSeconds = previous[0] * 60 + previous[1]
                const diffSeconds = currentSeconds - previousSeconds

                const percentageDifference = (diffSeconds / previousSeconds) * 100

                const diffMinutes = Math.floor(Math.abs(diffSeconds) / 60)
                const diffSecondsRemainder = Math.abs(diffSeconds) % 60

                const diffDisplay = (diffSeconds < 0 ? "-" : "") + (diffMinutes < 10 ? "0" : "") + diffMinutes + ":" + (diffSecondsRemainder < 10 ? "0" : "") + Math.abs(diffSecondsRemainder)

                difference.percent = percentageDifference.toFixed(2)
                difference.display = diffDisplay

                result.isProgress = percentageDifference >= 0 ? false : true
                result.difference = difference

                if (percentageDifference > 0) {
                    result.isProgress = false
                } else if (percentageDifference < 0) {
                    result.isProgress = true
                }
            }

            return result
        },
        getAverageSpeed() {
            if (!this.item || this.item.length === 0) {
                return null
            }

            const result = {
                value: {
                    display: this.item.average_speed
                },
                unit: 'km/h'
            }

            if (this.itemPreviousShow && this.itemPrevious && this.itemPrevious.average_speed) {
                const difference = {}

                const current = parseFloat(this.item.average_speed)
                const previous = parseFloat(this.itemPrevious.average_speed)

                const percentageDifference = ((current - previous) / previous) * 100

                difference.percent = percentageDifference.toFixed(2)
                difference.display = (current - previous).toFixed(2)

                result.isProgress = percentageDifference <= 0 ? false : true
                result.difference = difference

                if (percentageDifference > 0) {
                    result.isProgress = true
                } else if (percentageDifference < 0) {
                    result.isProgress = false
                }
            }

            return result
        }
    }
}
</script>
