import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['authorization'] = getToken()
    }
    if (config.method === 'get') {
      const params = {
        ...config.params,
        _t: new Date().getTime()
      }
      config.params = params
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const isDownload = response.config.url.indexOf('download') !== -1
    const responseType = response.request.responseType

    if (responseType === 'blob') {
      return response
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== '200' && !isDownload) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      if (isDownload) {
        return response
      } else {
        return res
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response.status === 401) {
      // MessageBox.confirm('您的登录状态已失效，您可以取消停留在此页面，或重新登录', '提示', {
      //   confirmButtonText: '重新登录',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      // })
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 3 * 1000,
        onClose: () => {
          if (getToken()) {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }
        }
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
