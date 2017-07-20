import { ipcRenderer, remote } from 'electron'

const state = {
  BUSY_FETCHINGARTICLES: remote.getGlobal('BUSY_FETCHINGARTICLES'),
  ONLINE_STATUS: remote.getGlobal('ONLINE_STATUS')
}

const mutations = {
  BUSY_FETCHINGARTICLES (state, arg) {
    state.BUSY_FETCHINGARTICLES = arg
  },
  ONLINE_STATUS_CHANGED (state) {
    state.ONLINE_STATUS = remote.getGlobal('ONLINE_STATUS')
  }
}

const getters = {
  getBusyFetchingArticles (state) {
    return state.BUSY_FETCHINGARTICLES
  },
  getOnlineStatus (state) {
    return state.ONLINE_STATUS
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
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
