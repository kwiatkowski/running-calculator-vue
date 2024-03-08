<template>
    <tr :key="index">
        <td
        class="list-td--ord"
        v-html="getOrd(index)"
        ></td>

        <td
        class="list-td--date_run"
        v-html="$formatDate(item.date)"
        ></td>

        <td
        class="list-td--type"
        v-html="$t('calc.type.' + item.type)"
        ></td>

        <td
        class="list-td--distance"
        v-html="$filters.formatDistance(item.distance, 'km')"
        ></td>

        <td
        class="list-td--duration"
        v-html="item.duration"
        ></td>

        <td
        class="list-td--stride_length"
        v-html="item.stride_length"
        ></td>

        <td
        class="list-td--cadence"
        v-html="item.cadence"
        ></td>

        <td
        class="list-td--average_heart_rate"
        v-html="item.average_heart_rate"
        ></td>

        <td
        class="list-td--v02max"
        v-html="item.v02max"
        ></td>

        <td
        class="list-td--average_pace"
        v-html="item.average_pace"
        ></td>

        <td
        class="list-td--average_speed"
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
