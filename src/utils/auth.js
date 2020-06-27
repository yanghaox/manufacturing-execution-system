import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 权限
export function setCompetence(competence) {
  return localStorage.setItem('competence', JSON.stringify(competence))
}

export function getCompetence() {
  const permission = JSON.parse(localStorage.getItem('competence'))
  const _competence = {
    get: [],
    post: [],
    put: [],
    delete: [],
    menu: []
  }
  if (typeof permission === 'object' && permission instanceof Object) {
    for (const item of permission) {
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
  }
  return _competence
}

export function removeCompetence() {
  return localStorage.removeItem('competence')
}
