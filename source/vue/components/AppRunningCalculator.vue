<template>
    <div class="app--vue">
        <div class="list">
            <ListHeader
            :loader="listLoader"
            @refreshList="refreshList()"
            />

            <ListTable
            :loader="listLoader"
            :columns="listColumns"
            :data="list"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import ListTable from '~/components/Core/ListTable.vue'
import ListHeader from '~/components/Core/ListHeader.vue'

export default {
    components: {
        ListTable, ListHeader
    },
    computed: {
        ...mapState('calc', [
            'listLoader', 'list', 'listColumns'
        ])
    },
    methods: {
        ...mapActions('calc', [
            'getListCalc'
        ]),
        refreshList() {
            this.getListCalc({})
        }
    },
    mounted() {
        this.getListCalc({})
    },
    created() {
        this.$eventBus.$on('todo-refresh-list', this.refreshList)
    },
    beforeUnmount() {
        this.$eventBus.$off('todo-refresh-list', this.refreshList)
    }
}
</script>
