import TodosAPI from '~/api/api-todos'

import Loader from '~/store/Core/loader'

export default {
    namespaced: true,
    state: {
        listLoader: {...Loader.states},
        list: [],
        listColumns: [
            {
                name: 'lp'
            },
            {
                name: 'due_date'
            },
            {
                name: 'name'
            },
            {
                name: 'status'
            },
            {
                name: 'story_points'
            }
        ],
        filterStatus: null,
        filterStatusOptions: [
            {
                value: 'todo',
                label: 'Todo'
            },
            {
                value: 'progress',
                label: 'Progress'
            },
            {
                value: 'test',
                label: 'Test'
            },
            {
                value: 'reopened',
                label: 'Reopened'
            },
            {
                value: 'done',
                label: 'Done'
            }
        ],
        filterType: null,
        filterTypeOptions: [
            {
                value: 'task',
                label: 'Task'
            },
            {
                value: 'idea',
                label: 'Idea'
            },
            {
                value: 'bug',
                label: 'Bug'
            }
        ]
    },
    mutations: {
        ...Loader.mutations,
        setList(state, payload) {
            state.list = payload
        },
        setFilterStatus(state, payload) {
            state.filterStatus = payload
        },
        setFilterType(state, payload) {
            state.filterType = payload
        },
        updateElement(state, payload) {
            const indexToUpdate = state.list.findIndex(item => item.id === payload.id)

            if (indexToUpdate !== -1) {
                state.list[indexToUpdate] = payload.data
            }
        },
        updateElementById(state, payload) {
            const list = state.list.find(item => item.id === payload.id)

            if (list) {
              list[payload.field] = payload.state
            }
        },
        updateTitleById(state, payload) {
            const todo = state.list.find(item => item.id === payload.id)

            if (todo) {
              todo.title.rendered = payload.title
            }
        },
    },
    actions: {
        getTodos({ state, commit }, {}) {
            commit('loadStart', { name: 'listLoader' })

            return TodosAPI.getTodos({ perPage: 99999 })
                .then((response) => {
                    const list = response.data.map(item => ({
                        ...item,
                        isLoading: false,
                        isError: false,
                        isEdit: false
                    }))

                    const sortedList = list.sort((a, b) => {
                        if (a.acf.status === 'done' && b.acf.status !== 'done') {
                            return 1
                        }

                        if (a.acf.status !== 'done' && b.acf.status === 'done') {
                            return -1
                        }

                        return 0
                    })

                    commit('setList', sortedList)

                    commit('loadSuccess', { name: 'listLoader' })
                })
                .catch((error) => {
                    commit('loadError', { name: 'listLoader' })
                })
        },
        updateTodo({ state, commit }, payload) {
            commit('updateElementById', { id: payload.id, field: 'isLoading', state: true })

            const postData = state.list.find(element => element.id === payload.id)
            let updatedData = updateObject(postData, payload.data)

            return TodosAPI.updateTodo({ postID: payload.id, postData: updatedData })
                .then((response) => {
                    commit('updateElement', { id: response.data.id, data: response.data })
                    commit('updateElementById', { id: payload.id, field: 'isLoading', state: false })
                })
                .catch((error) => {
                    commit('updateElementById', { id: payload.id, field: 'isError', state: true })
                })
        }
    }
}

function updateObject(baseObject, updates) {
    const updatedObject = { ...baseObject }

    for (const key in updates) {
        if (baseObject.hasOwnProperty(key)) {
            if (typeof updates[key] === 'object' && updates[key] !== null) {
                updatedObject[key] = { ...baseObject[key], ...updates[key] }
            } else {
                updatedObject[key] = updates[key]
            }
        }
    }

    return updatedObject
}
