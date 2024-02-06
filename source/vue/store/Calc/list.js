import CalcAPI from '~/api/api-calc'

import Loader from '~/store/Core/loader'

export default {
    namespaced: true,
    state: {
        listLoader: {...Loader.states},
        list: [],
        listColumns: [
            {
                name: 'ord'
            },
            {
                name: 'date_run'
            },
            {
                name: 'distance'
            },
            {
                name: 'duration'
            },
            {
                name: 'stride_length'
            },
            {
                name: 'average_heart_rate'
            },
            {
                name: 'v02max'
            },
            {
                name: 'cadence'
            },
            {
                name: 'average_pace'
            },
            {
                name: 'average_speed'
            },
        ]
    },
    mutations: {
        ...Loader.mutations,
        setList(state, payload) {
            state.list = payload
        }
    },
    actions: {
        getListCalc({ state, commit }, {}) {
            commit('loadStart', { name: 'listLoader' })

            return CalcAPI.getPost({ perPage: 99999 })
                .then((response) => {
                    commit('setList', response.data)
                    commit('loadSuccess', { name: 'listLoader' })
                })
                .catch((error) => {
                    commit('loadError', { name: 'listLoader' })
                })
        }
    }
}
