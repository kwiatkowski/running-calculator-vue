<template>
    <div class="list__header">
        <Multiselect
        v-if="filterStatusOptions"
        class="multiselect--status"
        placeholder="Wybierz status"
        :options="filterStatusOptions"
        :disabled="loader.isLoading || (loader && loader.hasOwnProperty('isLoading') && loader.isLoading)"
        @change="onChangeStatus"
        />

        <Multiselect
        v-if="filterTypeOptions"
        class="multiselect--type"
        placeholder="Wybierz typ"
        :options="filterTypeOptions"
        :disabled="loader.isLoading || (loader && loader.hasOwnProperty('isLoading') && loader.isLoading)"
        @change="onChangeType"
        />

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
        },
        filterStatus: {
            type: String,
            default: null
        },
        filterStatusOptions: {
            type: Array,
            default: null
        },
        filterType: {
            type: String,
            default: null
        },
        filterTypeOptions: {
            type: Array,
            default: null
        }
    },
    methods: {
        clickRefreshList() {
            this.$emit('refresh-list')
        },
        onChangeStatus(event) {
            this.$emit('change-status', event)
        },
        onChangeType(event) {
            this.$emit('change-type', event)
        }
    }
}
</script>
