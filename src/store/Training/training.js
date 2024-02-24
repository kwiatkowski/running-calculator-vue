import TrainingAPI from '~/api/api-training'

import Loader from '~/store/Core/loader'

import ShoesStore from '~/store/Training/shoes'

export default {
    namespaced: true,
    modules: {
        shoes: ShoesStore
    },
    state: {
        list: [],
        listLoader: {...Loader.states},
        listColumns: [
            {
                name: 'ord'
            },
            {
                name: 'date_run'
            },
            {
                name: 'type'
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
        filterType: null,
        filterTypeOptions: [
            'calm',
            'running_around',
            'verification',
            'competition'
        ],
        filterDistance: null,
        filterDistanceOptions: [
            {
                name: '5km',
                value: 5000
            },
            {
                name: '10km',
                value: 10000
            },
            {
                name: 'half_marathon',
                value: 21097
            },
            {
                name: 'marathon',
                value: 42195
            }
        ],
        groupBy: null,
        groupByOptions: ['month', 'year'],
        distances: [
            {
                name: '5km',
                value: 5000
            },
            {
                name: '10km',
                value: 10000
            },
            {
                name: 'half_marathon',
                value: 21097
            },
            {
                name: 'marathon',
                value: 42195
            }
        ]
    },
    mutations: {
        ...Loader.mutations,
        setList(state, payload) {
            const yearsArray = Array.from(new Set(payload.map(item => new Date(item.date).getFullYear())))

            state.list = payload
            state.filterYearsOptions = yearsArray
        },
        setListFilterByYear(state, payload) {
            state.filterYears = payload
        },
        setListFilterByType(state, payload) {
            state.filterType = payload
        },
        setListFilterByDistance(state, payload) {
            state.filterDistance = payload
        },
        setListGroupBy(state, payload) {
            state.groupBy = payload
        }
    },
    actions: {
        getListCalc({ state, commit }, {}) {
            commit('loadStart', { name: 'listLoader' })

            return TrainingAPI.getPost({ perPage: 99999 })
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
                        delete item.training_shoes

                        item.distance = item.acf.distance
                        item.duration = item.acf.duration
                        item.stride_length = item.acf.stride_length
                        item.average_heart_rate = item.acf.average_heart_rate
                        item.v02max = item.acf.v02max
                        item.shoe = item.acf.shoe
                        item.type = item.acf.type

                        delete item.acf

                        item.cadence = calculateSpeedPaceAndCadence(item.distance, item.duration, item.stride_length).cadence
                        item.average_pace = calculateSpeedPaceAndCadence(item.distance, item.duration).pace
                        item.average_speed = calculateSpeedPaceAndCadence(item.distance, item.duration).speed
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

function calculateSpeedPaceAndCadence(distance, duration, strideLength = null) {
    // Split the time into hours, minutes, and seconds
    let [hours, minutes, seconds] = duration.split(':').map(Number)

    // Calculate the time in total minutes
    let totalMinutes = hours * 60 + minutes + seconds / 60

    // Calculate the time in seconds
    let totalSeconds = hours * 3600 + minutes * 60 + seconds

    // Convert meters to kilometers
    let distanceInKilometers = distance * 0.001

    // Calculate cadence (steps per minute)
    let cadence = Math.round((distance / (strideLength / 100)) / totalMinutes)

    // Calculate speed in kilometers per hour
    let speedInKilometersPerHour = distanceInKilometers / (totalSeconds / 3600)

    // Calculate pace in seconds per kilometer
    let paceInSecondsPerKilometer = totalSeconds / distanceInKilometers

    // Calculate pace in minutes and seconds
    let paceMinutes = Math.floor(paceInSecondsPerKilometer / 60)
    let paceSeconds = Math.round(paceInSecondsPerKilometer % 60)

    return {
        speed: `${speedInKilometersPerHour.toFixed(2)}`,
        pace: `${paceMinutes.toString().padStart(2, '0')}:${paceSeconds.toString().padStart(2, '0')}`,
        cadence: `${cadence}`
    }
}