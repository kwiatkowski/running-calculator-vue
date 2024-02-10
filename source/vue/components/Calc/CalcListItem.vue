<template>
    <tr
    :key="index"
    :class="[
        item.isLoading === true ? 'tr--is-loading' : null,
        item.isError === true ? 'tr--is-error' : null
    ]"
    >
        <td v-html="getOrd(index)"></td>

        <td
        class="calc-td--date-run"
        v-html="$formatDate(item.date)"
        ></td>

        <td class="calc-td--distance">
            {{ item.distance }}
        </td>

        <td class="calc-td--duration">
            {{ item.duration }}
        </td>

        <td class="calc-td--stride_length">
            {{ item.stride_length }}
        </td>

        <td class="calc-td--average_heart_rate">
            {{ item.average_heart_rate }}
        </td>

        <td class="calc-td--v02max">
            {{ item.v02max }}
        </td>

        <td
        class="calc-td--cadence"
        v-html="getAverageCadence()"
        ></td>

        <td
        class="calc-td--average_pace"
        v-html="getAveragePace()"
        ></td>

        <td
        class="calc-td--average_speed"
        v-html="getAverageSpeed()"
        ></td>
    </tr>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: null
        },
        index: {
            type: Number,
            default: null
        }
    },
    computed: {
        getOrd() {
            return (index) => index + 1
        }
    },
    methods: {
        calculateSpeedPaceAndCadence() {
            let duration = this.item.duration
            let distance = this.item.distance
            let strideLength = this.item.stride_length

            // Split the time into hours, minutes, and seconds
            let [hours, minutes, seconds] = duration.split(':').map(Number)

            // Calculate the time in total minutes
            let totalMinutes = hours * 60 + minutes + seconds / 60

            // Calculate the time in seconds
            let totalSeconds = hours * 3600 + minutes * 60 + seconds

            // Convert meters to kilometers
            let distanceInKilometers = distance * 0.001

            // Calculate cadence (steps per minute)
            let cadence = Math.round((distance / (strideLength / 100)) / totalMinutes)

            // Calculate speed in kilometers per hour
            let speedInKilometersPerHour = distanceInKilometers / (totalSeconds / 3600)

            // Calculate pace in seconds per kilometer
            let paceInSecondsPerKilometer = totalSeconds / distanceInKilometers

            // Calculate pace in minutes and seconds
            let paceMinutes = Math.floor(paceInSecondsPerKilometer / 60)
            let paceSeconds = Math.round(paceInSecondsPerKilometer % 60)

            return {
                speed: `${speedInKilometersPerHour.toFixed(2)}`,
                pace: `${paceMinutes.toString().padStart(2, '0')}:${paceSeconds.toString().padStart(2, '0')}`,
                cadence: `${cadence}`
            }
        },
        getAverageCadence() {
            return this.calculateSpeedPaceAndCadence().cadence
        },
        getAveragePace() {
            return this.calculateSpeedPaceAndCadence().pace
        },
        getAverageSpeed() {
            return this.calculateSpeedPaceAndCadence().speed
        }
    }
}
</script>
