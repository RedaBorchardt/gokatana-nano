import { ipcRenderer } from 'electron'

const state = {
  lastentry: {type: '', time: '', message: ''}
}

const mutations = {
  ADD_LOG_ENTRY (state, logitem) {
    state.lastentry = logitem
  }
}

const getters = {
  getLastLogEntry (state) {
    return state.lastentry
  }
}

const actions = {
  listenForLogFromBackend ({commit}) {
    ipcRenderer.on('CLIENT_LOG', function (event, logitem) {
      commit('ADD_LOG_ENTRY', logitem)
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
