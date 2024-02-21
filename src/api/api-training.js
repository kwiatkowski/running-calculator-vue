import axios from 'axios'

// https://kwiatkowski.co/wp-json/wp/v2/training?per_page=99999&orderby=date&order=desc
const api = axios.create({
    baseURL: 'https://kwiatkowski.co/wp-json/wp/v2/',
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
