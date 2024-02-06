<template>
    <span
    v-if="editField === null"
    class="edit-inline__text"
    @click="handleEdit({ field: 'editField', data: edit.value })"
    >
        <span
        v-if="type === 'status'"
        :class="'badge badge--status-' + edit.value"
        v-text="edit.value"
        ></span>

        <span
        v-else-if="type === 'story_points'"
        class="badge"
        v-text="edit.value"
        ></span>

        <template v-else>
            {{ edit.value }}
        </template>
    </span>

    <template v-else>
        <Multiselect
        v-if="type === 'status' && filterStatusOptions"
        :ref="'editField[' + edit.field + ']'"
        class="multiselect--status-td"
        placeholder="Wybierz status"
        v-model="v$.editField.$model"
        :options="filterStatusOptions"
        :canClear="false"
        @change="handleChangeStatus"
        @keydown.esc="handleEscKey"
        @close="handleEscKey"
        />

        <input
        v-else
        :ref="'editField[' + edit.field + ']'"
        type="text"
        v-model="v$.editField.$model"
        @keydown.esc="handleEscKey"
        @keydown.enter="handleEnterKey"
        @blur="handleBlur"
        />
    </template>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
    props: {
        item: {
            type: Object,
            default: []
        },
        edit: {
            type: Object,
            default: []
        },
        type: {
            type: String,
            default: null
        },
        field: {
            type: String,
            default: null
        },
    },
    setup() {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            editField: null,
            escapeKeyPressed: false
        }
    },
    validations() {
        return {
            editField: { required }
        }
    },
    computed: {
        ...mapState('todos', [
            'filterStatusOptions', 'filterStatus',
        ]),
    },
    methods: {
        ...mapMutations('todos', [
            'updateElementById'
        ]),
        ...mapActions('todos', [
            'updateTodo'
        ]),
        handleEdit(payload) {
            this.updateElementById({ id: this.item.id, field: 'isEdit', state: true })
            this[payload.field] = payload.data

            this.$nextTick(() => {
                const refKey = 'editField[' + this.edit.field + ']'

                if (this.$refs[refKey]) {
                    if (this.type === 'status') {
                        // this.$refs[refKey].$el.focus()
                        // this.$refs[refKey].open()
                        this.$refs[refKey].$el.click()
                    } else {
                        this.$refs[refKey].focus()
                    }
                }
            })
        },
        handleFocus() {
            this.v$.editField.$touch()
        },
        handleEscKey() {
            console.log('handleEscKey')
            this.escapeKeyPressed = true

            this.fieldEditCancel()
        },
        handleEnterKey() {
            if (this.v$.$dirty && this.editField !== this.edit.value) {
                this.fieldSave({ field: 'editField', data: this.edit.fieldKey })
            } else {
                this.fieldEditCancel()
            }
        },
        handleBlur() {
            if (this.editField && this.escapeKeyPressed === false) {
                if (this.v$.$dirty && this.editField !== this.edit.value) {
                    this.fieldSave({ field: 'editField', data: this.edit.fieldKey })
                } else {
                    this.fieldEditCancel()
                }
            }

            this.escapeKeyPressed = false
        },
        handleChangeStatus(event) {
            console.log('handleChangeStatus: ', event)

            this.editField = event

            this.fieldSave({ field: 'editField', data: this.edit.fieldKey })
        },
        fieldEditCancel() {
            this.updateElementById({ id: this.item.id, field: 'isEdit', state: false })
            this.editField = null

            this.v$.$reset()
        },
        fieldSave(payload) {
            const propertyPath = this.edit.field
            const propertyParts = propertyPath.split('.')

            const newObj = propertyParts.reduceRight((acc, property) => {
                const tempObj = { [property]: acc }

                return tempObj
            }, this.editField)

            this.updateTodo({ id: this.item.id, data: newObj })
                .finally(() => {
                    if (this.type === 'status' && this.editField === 'done') {
                        this.$eventBus.$emit('todo-refresh-list')
                    } else {
                        this.updateElementById({ id: this.item.id, field: 'isEdit', state: false })
                        this.editField = null

                        this.v$.$reset()
                    }
                })
        },
    }
}
</script>
