<template>
    <div
    :class="[
        'statistics__item',
        !label ? 'statistics__item--inline': null
    ]"
    @click.stop
    >
        <strong
        v-if="label"
        class="statistics__label"
        v-html="label"
        ></strong>

        <span
        v-html="' (' + (data && data.value ? data.value : '-') + ')'"
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
        }
    }
}
</script>
