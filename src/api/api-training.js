import axios from 'axios'

const api = axios.create({
    baseURL: process.env.VUE_APP_API,
})

const addCacheBuster = (params = {}) => {
    return {
        ...params,
        _t: new Date().getTime()  // Dodaje parametr _t z wartością czasu w milisekundach
    };
};

export default {
    getPost: ({ perPage }) => api.get('training', {
        params: addCacheBuster({
            per_page: perPage,
            orderby: 'date',
            order: 'desc',
        })
    }),
    getTrainingShoes: () => api.get('training_shoes', {
        params: addCacheBuster()
    })
}
