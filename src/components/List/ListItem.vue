<template>
    <tr :key="index">
        <td v-html="getOrd(index)"></td>

        <td
        class="calc-td--date-run"
        v-html="$formatDate(item.date)"
        ></td>

        <td
        class="calc-td--date-run"
        v-html="$t('calc.type.' + item.type)"
        ></td>

        <td
        class="calc-td--distance"
        v-html="$filters.formatDistance(item.distance, 'km')"
        ></td>

        <td
        class="calc-td--duration"
        v-html="item.duration"
        ></td>

        <td
        class="calc-td--stride_length"
        v-html="item.stride_length"
        ></td>

        <td
        class="calc-td--cadence"
        v-html="item.cadence"
        ></td>

        <td
        class="calc-td--average_heart_rate"
        v-html="item.average_heart_rate"
        ></td>

        <td
        class="calc-td--v02max"
        v-html="item.v02max"
        ></td>

        <td
        class="calc-td--average_pace"
        v-html="item.average_pace"
        ></td>

        <td
        class="calc-td--average_speed"
        v-html="item.average_speed"
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
    }
}
</script>
