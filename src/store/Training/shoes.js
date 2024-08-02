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
        async getTrainingShoes({ commit }) {
            commit('loadStart', { name: 'shoesLoader' })

            try {
                const response = await TrainingAPI.getTrainingShoes({})

                let shoes = response.data

                shoes.forEach((item) => {
                    delete item.description
                    delete item.link
                    delete item.taxonomy
                    delete item.parent
                    delete item.meta
                    delete item.yoast_head
                    delete item.yoast_head
                    delete item.yoast_head_json
                    delete item._links

                    item.isUsed = item.acf.is_used
                    item.fullName = item.acf.full_name
                    item.purchaseDate = item.acf.purchase_date

                    delete item.acf
                })

                commit('setShoes', shoes)
                commit('loadSuccess', { name: 'shoesLoader' })
            } catch (error) {
                commit('loadError', { name: 'shoesLoader', error: error.response.data })
            }
        }
    }
}
