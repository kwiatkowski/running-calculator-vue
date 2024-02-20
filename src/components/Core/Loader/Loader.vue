<template>
    <div
    v-if="loader.isLoading"
    class="loader__wrap"
    >
        <div
        v-if="type === 'blur'"
        class="loader loader--blur"
        ></div>

        <div
        v-else
        class="loader"
        >
            <span class="loader__circle"></span>
            <span class="loader__circle"></span>
            <span class="loader__circle"></span>
            <span class="loader__circle"></span>
        </div>

        <div
        v-if="text"
        class="loader__text"
        v-html="text"
        ></div>
    </div>
</template>

<script>
export default {
    props: {
        loader: {
            type: Object,
            default: {}
        },
        type: {
            type: String,
            default: null
        },
        text: {
            type: String,
            default: null
        }
    }
}
</script>
