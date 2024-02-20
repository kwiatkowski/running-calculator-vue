import axios from 'axios'
import VueAxios from 'vue-axios'

export default function setupAxios(app) {
    app.use(VueAxios, axios)
}
