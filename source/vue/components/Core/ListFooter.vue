<template>
    <div class="list__footer">
        <div
        class="list__pager"
        v-if="totalPages > 1"
        >
            <button
            class="btn"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1 || (loader && loader.hasOwnProperty('isLoading') && loader.isLoading)"
            >
                <i class="icon-angle-left" />
            </button>

            <span>
                Strona {{ currentPage }} z {{ totalPages }}
            </span>

            <button
            class="btn"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages || (loader && loader.hasOwnProperty('isLoading') && loader.isLoading)"
            >
                <i class="icon-angle-right" />
            </button>
        </div>

        <div class="list__rows">
            Wierszy na stronę

            <Multiselect
            :value="rowsPerPage"
            class="multiselect--rows-per-page"
            :options="listRowOptions"
            :canClear="false"
            @change="changeRowsPerPage"
            :disabled="loader && loader.hasOwnProperty('isLoading') && loader.isLoading"
            />
        </div>

        <div class="list__details">
            {{ (currentPage - 1) * rowsPerPage + 1 }} - {{ (currentPage - 1) * rowsPerPage + data.length }}
            z
            {{ dataTotal }}
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    props: {
        loader: {
            type: Object,
            default: null
        },
        data: {
            type: Array,
            default: null
        },
        currentPage: {
            type: Number,
            default: 1
        },
        rowsPerPage: {
            type: Number,
            default: 10
        },
        dataTotal: {
            type: Number,
            default: 10
        }
    },
    computed: {
        ...mapState([
            'listRowOptions',
        ]),
        totalItems() {
            return this.data.length
        },
        totalPages() {
            return Math.ceil(this.dataTotal / this.rowsPerPage)
        }
    },
    methods: {
        goToPage(pageNumber) {
            this.$emit('change-current-page', pageNumber)
        },
        changeRowsPerPage(event) {
            this.$emit('change-current-page', 1)
            this.$emit('change-rows-per-page', event)
        }
    }
}
</script>
