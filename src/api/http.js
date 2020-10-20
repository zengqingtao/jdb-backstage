import axios from './fetch'
import qs from 'qs'

export default {
  post: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(params))
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  jsonPost: (url, params = {}, headers) => {
    return new Promise((resolve, reject) => {
      axios.post(url, params, { headers })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  get: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      axios.get(url, { params })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  formData: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}