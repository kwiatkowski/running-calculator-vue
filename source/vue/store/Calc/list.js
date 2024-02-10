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
        ],
        filterYears: null,
        filterYearsOptions: [],
    },
    mutations: {
        ...Loader.mutations,
        setList(state, payload) {
            const yearsArray = Array.from(new Set(payload.map(item => new Date(item.date).getFullYear())))

            state.list = payload
            state.filterYearsOptions = yearsArray
        },
        filterListByYear(state, selectedYear) {
            if (!selectedYear) {
                state.filterYears = null
                state.list = [...state.originalList]

                return
            }

            state.filterYears = selectedYear

            if (!state.originalList) {
                state.originalList = state.list.slice()
            }

            state.list = state.originalList.filter(item => {
                const itemYear = new Date(item.date).getFullYear()

                return itemYear === selectedYear
            })
        }
    },
    actions: {
        getListCalc({ state, commit }, {}) {
            commit('loadStart', { name: 'listLoader' })

            return CalcAPI.getPost({ perPage: 99999 })
                .then((response) => {
                    let list = response.data

                    list.forEach((item) => {
                        delete item.id
                        delete item.guid
                        delete item.slug
                        delete item.status
                        delete item.type
                        delete item.link
                        delete item.title
                        delete item.template
                        delete item._links
                        delete item.modified
                        delete item.modified_gmt
                        delete item.date_gmt

                        item.distance = item.acf.distance
                        item.duration = item.acf.duration
                        item.stride_length = item.acf.stride_length
                        item.average_heart_rate = item.acf.average_heart_rate
                        item.v02max = item.acf.v02max

                        delete item.acf
                    })

                    commit('setList', list)
                    commit('loadSuccess', { name: 'listLoader' })
                })
                .catch((error) => {
                    commit('loadError', { name: 'listLoader' })
                })
        }
    }
}
