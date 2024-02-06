import axios from 'axios'

const api = axios.create({
    baseURL: '/wp-json/wp/v2/',
})

export default {
    getTodos: ({ perPage }) => api.get('/todos', {
        params: {
            per_page: perPage,
            orderby: 'menu_order',
            order: 'asc',
        }
    }),
    updateTodo: ({ postID, postData }) => {
        const nonce = localStorage.getItem('nonce')
        const url = `/todos/${postID}?_wpnonce=${nonce}`

        return api.post(url, postData)
    }
}
