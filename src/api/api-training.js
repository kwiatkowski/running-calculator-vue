import axios from 'axios'

const api = axios.create({
    baseURL: process.env.VUE_APP_API,
})

export default {
    getPost: ({ perPage }) => api.get('training', {
        params: {
            per_page: perPage,
            orderby: 'date',
            order: 'desc',
        }
    }),
    getTrainingShoes: () => api.get('training_shoes')
}
