import axios from 'axios'

const base_api_url = 'http://localhost/api/spreadbills/v1/'

const axiosIns = axios.create({
// You can add your headers here
// ================================
  baseURL: base_api_url,

// timeout: 1000,
// headers: {'X-Custom-Header': 'foobar'}
})

export default axiosIns
