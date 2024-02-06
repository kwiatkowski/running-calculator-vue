<template>
    <div class="app--vue">
        <div class="list">
            <ListHeader
            :loader="listLoader"
            :filterStatus="filterStatus"
            :filterStatusOptions="filterStatusOptions"
            :filterType="filterType"
            :filterTypeOptions="filterTypeOptions"
            @changeStatus="setFilterStatus($event)"
            @changeType="setFilterType($event)"
            @refreshList="refreshList()"
            />

            <ListTable
            :loader="listLoader"
            :columns="listColumns"
            :data="dataPaginated"
            :currentPage="currentPage"
            :rowsPerPage="rowsPerPage"
            />

            <ListFooter
            :loader="listLoader"
            :data="dataPaginated"
            :dataTotal="dataTotal"
            :currentPage="currentPage"
            :rowsPerPage="rowsPerPage"
            @changeCurrentPage="changeCurrentPage($event)"
            @changeRowsPerPage="changeRowsPerPage($event)"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import ListTable from '~/components/Core/ListTable.vue'
import ListHeader from '~/components/Core/ListHeader.vue'
import ListFooter from '~/components/Core/ListFooter.vue'

export default {
    components: {
        ListTable, ListHeader, ListFooter
    },
    data() {
        return {
            currentPage: 1,
            rowsPerPage: null,
            nonce: null
        }
    },
    computed: {
        ...mapState('todos', [
            'listLoader', 'list', 'listColumns',
            'filterStatusOptions', 'filterStatus',
            'filterTypeOptions', 'filterType'
        ]),
        dataPaginated() {
            const start = (this.currentPage - 1) * this.rowsPerPage
            const end = start + this.rowsPerPage

            return this.filteredList.slice(start, end)
        },
        filteredList() {
            return this.list.filter(item => {
                const statusCondition = this.filterStatus === null || item.acf.status === this.filterStatus
                const typeCondition = this.filterType === null || item.acf.type === this.filterType

                return statusCondition && typeCondition
            })
        },
        dataTotal() {
            return this.filteredList.length
        }
    },
    watch: {
        filterStatus() {
            this.currentPage = 1
        },
        filterType() {
            this.currentPage = 1
        }
    },
    methods: {
        ...mapMutations('todos', [
            'setFilterStatus', 'setFilterType'
        ]),
        ...mapActions('todos', [
            'getTodos'
        ]),
        refreshList() {
            this.getTodos({})
        },
        changeCurrentPage(payload) {
            this.currentPage = payload
        },
        changeRowsPerPage(payload) {
            this.rowsPerPage = payload
            this.setLocalStorageTodoList(payload)
        },
        setLocalStorageTodoList(payload) {
            let arr = { rowsPerPage: payload }

            localStorage.setItem('todo/list', JSON.stringify(arr))
        },
        getLocalStorageTodoList() {
            if (localStorage.getItem('todo/list')) {
                try {
                    const settingsList = JSON.parse(localStorage.getItem('todo/list'))
                    this.rowsPerPage = settingsList.rowsPerPage
                } catch (e) {
                    this.rowsPerPage = 10
                }
            } else {
                this.rowsPerPage = 10
            }
        }
    },
    mounted() {
        // localStorage.setItem('nonce', document.getElementById('app-running-calculator').getAttribute('data-nonce'))

        // this.getTodos({})
        // this.getLocalStorageTodoList()
    },
    created() {
        this.$eventBus.$on('todo-refresh-list', this.refreshList)
    },
    beforeUnmount() {
        this.$eventBus.$off('todo-refresh-list', this.refreshList)
    }
}
</script>
