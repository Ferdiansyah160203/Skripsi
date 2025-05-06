const state = {
  isLoggedIn: false,
  token: null,
}

const mutations = {
  setLoggedIn(state, value) {
    state.isLoggedIn = value
  },
  setToken(state, token) {
    state.token = token
  },
}

const actions = {
  login({ commit }, token) {
    commit('setLoggedIn', true)
    commit('setToken', token)
  },
  logout({ commit }) {
    commit('setLoggedIn', false)
    commit('setToken', null)
  },
  checkAuthentication({ commit }) {
    const token = localStorage.getItem('accessToken')
    if (token) {
      commit('setLoggedIn', true)
      commit('setToken', token)
    }
  },
}

const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  token: (state) => state.token,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
