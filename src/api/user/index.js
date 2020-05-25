import axios from 'axios';

export default {
  ajax(params) {
    params.data = JSON.stringify(params.data)
    return axios.post('/api/open/main', params)
  },
  qrAjax(params) {
    return axios.get(`/api/h5/${params.id}.jpg?page=${params.page}`, { responseType: 'arraybuffer' })
  },
  ajax1(params) {
    params.data = JSON.stringify(params.data)
    return axios.post('/api/main', params)
  },
}
