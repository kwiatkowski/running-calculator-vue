import axios from 'axios'

const api = axios.create({
    baseURL: 'http://kwiatkowski.local/wp-json/wp/v2/',
})

export default {
    getPost: ({ perPage }) => api.get('/calc', {
        params: {
            per_page: perPage,
            orderby: 'date',
            order: 'desc',
        }
    })
}
