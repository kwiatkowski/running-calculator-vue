<template @click.stop>
    <div class="data-box">
        <div
        class="data-box__value"
        v-if="name"
        v-html="name"
        ></div>

        <div
        class="data-box__unit"
        v-html="' (' + (data && data.value ? data.value : '-') + ')'"
        ></div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
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
