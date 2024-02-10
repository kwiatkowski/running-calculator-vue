<template>
    <div class="list__header">
        <slot name="filters"></slot>

        <button
        class="btn"
        :disabled="loader.isLoading || (loader && loader.hasOwnProperty('isLoading') && loader.isLoading)"
        @click="clickRefreshList()"
        >
            <i class="icon-arrows-ccw" />
        </button>
    </div>
</template>

<script>
export default {
    props: {
        loader: {
            type: Object,
            default: null
        }
    },
    methods: {
        clickRefreshList() {
            this.$emit('refresh-list')
        }
    }
}
</script>
