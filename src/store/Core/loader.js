const states = {
    isLoading: null,
    isError: null,
    initialized: false,
    apiErrors: null,
    items: [],
}

const mutations = {
    loadStart(state, { name, items = [] }) {
        state[name].isLoading = true
        state[name].isError = false
        state[name].apiErrors = null
        state[name].items = items
    },
    loadSuccess(state, { name }) {
        state[name].isLoading = false
        state[name].isError = false
        state[name].initialized = true
        state[name].apiErrors = null
        state[name].items = []
    },
    loadError(state, { name, error = null }) {
        console.log('error')
        state[name].isLoading = false
        state[name].isError = true
        state[name].initialized = true
        state[name].apiErrors = error
    },
    updateApiErrors(state, { name, errors }) {
        state[name].apiErrors = errors
    },
    clearLoader(state, { name }) {
        state[name] = {...states}
    },
}

export default {
    states,
    mutations
}