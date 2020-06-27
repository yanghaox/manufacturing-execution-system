import { getCommonConfigDevice } from '@/api/common/config.js'
const state = {
  deviceFunctionCodeMap: new Map()
}

const mutations = {
  SET_DEVICE_FUNCTION_CODE: (state, device) => {
    Object.keys(device).forEach(key => {
      state.deviceFunctionCodeMap.set(key, device[key])
    })
  }
}

const actions = {
  getCommonConfigDevice({ commit }) {
    return new Promise((resolve, reject) => {
      getCommonConfigDevice().then(res => {
        const { device } = res.data
        commit('SET_DEVICE_FUNCTION_CODE', device)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
