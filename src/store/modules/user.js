import { login, logout } from '@/api/login'
import { getUserCompetence } from '@/api/user/user'
import { getToken, setToken, removeToken, setCompetence, getCompetence, removeCompetence } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    competence: getCompetence()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_COMPETENCE: (state, competence) => {
    const _competence = {
      get: [],
      post: [],
      put: [],
      delete: [],
      menu: []
    }
    for (const item of competence) {
      if (item.action.toUpperCase() === 'GET') {
        _competence.get.push(item)
      } else if (item.action.toUpperCase() === 'POST') {
        _competence.post.push(item)
      } else if (item.action.toUpperCase() === 'PUT') {
        _competence.put.push(item)
      } else if (item.action.toUpperCase() === 'DELETE') {
        _competence.delete.push(item)
      } else {
        _competence.menu.push(item)
      }
    }
    state.competence = _competence
  }
}

const actions = {
  // 权限
  setUserCompetence({ commit }, competence) {
    return new Promise((resolve, reject) => {
      commit('SET_COMPETENCE', competence)
      setCompetence(competence)
      resolve()
    })
  },

  // 获取路由权限
  getUserCompetence({ commit }) {
    return new Promise((resolve, reject) => {
      getUserCompetence().then(res => {
        const component = res.data
        resolve(component)
      }).catch(error => {
        reject(error.message)
      })
    })
  },

  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        removeCompetence()
        dispatch('permission/removeGenerateRoutes', null, { root: true })
        dispatch('tagsView/delAllViews', null, { root: true })
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

