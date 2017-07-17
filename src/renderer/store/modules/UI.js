import { ipcRenderer, remote } from 'electron'

const state = {
  BUSY_FETCHINGARTICLES: remote.getGlobal('BUSY_FETCHINGARTICLES')
}

const mutations = {
  BUSY_FETCHINGARTICLES (state, arg) {
    state.BUSY_FETCHINGARTICLES = arg
  }
}

const getters = {
  getBusyFetchingArticles (state) {
    return state.BUSY_FETCHINGARTICLES
  }
}

const actions = {
  checkIfBackendIsBusyFetchingArticles ({commit}) {
    ipcRenderer.on('BUSY_FETCHINGARTICLES', function (event, arg) {
      commit('BUSY_FETCHINGARTICLES', arg)
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
