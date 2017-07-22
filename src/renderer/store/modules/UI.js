import { ipcRenderer, remote } from 'electron'

const state = [{
  BUSY_FETCHINGARTICLES: remote.getGlobal('BUSY_FETCHINGARTICLES'),
  ONLINE_STATUS: remote.getGlobal('ONLINE_STATUS'),
  MOBILEVIEWER: false,
  FORCEDMINIBROWSER: false
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
  },
  TOGGLE_FORCEDMINIBROWSER (state) {
    state[0].FORCEDMINIBROWSER = !state[0].FORCEDMINIBROWSER
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
  },
  getForcedMiniBrowserState (state) {
    return state[0].FORCEDMINIBROWSER
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
  },
  toggleForcedMiniBrowser ({commit}) {
    commit('TOGGLE_FORCEDMINIBROWSER')
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
