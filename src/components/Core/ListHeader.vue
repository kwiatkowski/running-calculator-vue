<template>
    <div class="list__header">
        <slot name="gruped"></slot>

        <slot name="filters"></slot>

        <div class="list__header-actions">
            <button
            class="btn btn--icon"
            :disabled="loader.isLoading || (loader && loader.hasOwnProperty('isLoading') && loader.isLoading)"
            @click="clickRefreshList()"
            v-tooltip
            :title="$t('calc.list.actions.refresh.tooltip')"
            >
                <i class="bi bi-arrow-clockwise" />
            </button>
        </div>
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
