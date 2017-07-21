import { ipcRenderer, remote } from 'electron'

const state = [{
  BUSY_FETCHINGARTICLES: remote.getGlobal('BUSY_FETCHINGARTICLES'),
  ONLINE_STATUS: remote.getGlobal('ONLINE_STATUS'),
  MOBILEVIEWER: false
}]

const mutations = {
  BUSY_FETCHINGARTICLES (state, arg) {
    state[0].BUSY_FETCHINGARTICLES = arg
  },
  ONLINE_STATUS_CHANGED (state) {
    state[0].ONLINE_STATUS = remote.getGlobal('ONLINE_STATUS')
  },
  TOGGLE_MOBILE_VIEW (state) {
    state[0].MOBILEVIEWER = !state[0].MOBILEVIEWER
    state.push('update')
    state.pop()
  }
}

const getters = {
  getBusyFetchingArticles (state) {
    return state[0].BUSY_FETCHINGARTICLES
  },
  getOnlineStatus (state) {
    return state[0].ONLINE_STATUS
  },
  getMobileViewState (state) {
    return state[0].MOBILEVIEWER
  }
}

const actions = {
  checkIfBackendIsBusyFetchingArticles ({commit}) {
    ipcRenderer.on('BUSY_FETCHINGARTICLES', function (event, arg) {
      commit('BUSY_FETCHINGARTICLES', arg)
    })
  },
  checkIfApplicationIsOnline ({commit}) {
    commit('ONLINE_STATUS_CHANGED')
  },
  toggleMobileView ({commit}) {
    commit('TOGGLE_MOBILE_VIEW')
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
