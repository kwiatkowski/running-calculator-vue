import TrainingAPI from '~/api/api-training'

import Loader from '~/store/Core/loader'

export default {
    namespaced: true,
    state: {
        shoes: [],
        shoesLoader: {...Loader.states},
    },
    mutations: {
        ...Loader.mutations,
        setShoes(state, payload) {
            state.shoes = payload
        }
    },
    actions: {
        getTrainingShoes({ state, commit }, {}) {
            commit('loadStart', { name: 'shoesLoader' })

            return TrainingAPI.getTrainingShoes({})
                .then((response) => {
                    commit('setShoes', response.data)
                    commit('loadSuccess', { name: 'shoesLoader' })
                })
                .catch((error) => {
                    commit('loadError', { name: 'shoesLoader' })
                })
        }
    }
}
