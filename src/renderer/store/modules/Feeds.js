const {ipcRenderer} = require('electron')

const state = {
  subscriptions: []
}

const mutations = {
  HOIST_FEEDS_INTO_STATE (state, arg) {
    state.subscriptions = arg
    state.subscriptions[0].active = true // set default selected item
  }
}

const getters = {
  getFeeds (state) {
    return state.subscriptions
  }
}

const actions = {
  retrieveFeedsFromBackend ({commit}) {
    commit('HOIST_FEEDS_INTO_STATE', ipcRenderer.sendSync('RETRIEVE_FEEDS_FROM_FEEDSDB'))
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
