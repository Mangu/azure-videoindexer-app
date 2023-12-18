// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    loginInProgress: false,
  },
  mutations: {
    SET_LOGIN_STATE(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    SET_LOGIN_STATE_IN_PROGRESS(state, inProgress) {
      state.loginInProgress = inProgress;
    },
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    loginInProgress: state => state.loginInProgress,
  }
})