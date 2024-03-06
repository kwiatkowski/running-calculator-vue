<template>
    <div
    class=""
    :class="[
        'statistics__item',
        !label ? 'statistics__item--inline': null
    ]"
    >
        <span
        v-if="label"
        class="statistics__label"
        v-html="label + ': '"
        ></span>

        <span
        class="statistics__value"
        v-html="data ? data.value : '-'"
        ></span>

        <span
        v-if="data && data.unit"
        class="statistics__unit"
        v-html="data.unit"
        ></span>

        <span
        v-if="dataPrevious"
        :class="[
            'statistics__previous',
            'percent',
            formatData(dataPrevious) > 0 ? 'percent--increase' : null,
            formatData(dataPrevious) < 0 ? 'percent--decrease' : null
        ]"
        v-html="dataPrevious ? formatData(dataPrevious) + '%' : null"
        ></span>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: null
        },
        dataPrevious: {
            type: Object,
            default: null
        },
        label: {
            type: String,
            default: null
        }
    },
    methods: {
        formatData(data) {
            if (data) {
                const value = parseFloat(data.value)
                const formattedValue = value.toFixed(2)

                return formattedValue
            }
        }
    }
}
</script>
