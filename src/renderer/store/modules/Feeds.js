const {ipcRenderer} = require('electron')

const state = {
  subscriptions: []
}

const mutations = {
  HOIST_FEEDS_INTO_STATE (state, arg) {
    state.subscriptions = arg

    // HOIST The Default Article Count
    for (let i = 0; i < state.subscriptions.length; i++) {
      state.subscriptions[i].count = ipcRenderer.sendSync('RETRIEVE_COUNT_FROM_ARTICLEDB', state.subscriptions[i]._id)
    }
  },
  HOIST_ARTICLE_COUNT (state, arg) {
    for (let i = 0; i < state.subscriptions.length; i++) {
      if (state.subscriptions[i]._id === arg.feedid) {
        state.subscriptions[i].count = arg.count
      }
    }
    state.subscriptions.push('update')
    state.subscriptions.pop()
  },
  SET_SELECTED_FEED (state, feedid) {
    for (let i = 0; i < state.subscriptions.length; i++) {
      state.subscriptions[i].selected = false
      if (state.subscriptions[i]._id === feedid) {
        state.subscriptions[i].selected = true
      }
    }
    state.subscriptions.push('update')
    state.subscriptions.pop()
  }
}

const getters = {
  getFeeds (state) {
    return state.subscriptions
  }
}

const actions = {
  retrieveAllFeeds ({commit}) {
    // To be implemented
  },
  retrieveFeedsFromBackend ({commit}) {
    commit('HOIST_FEEDS_INTO_STATE', ipcRenderer.sendSync('RETRIEVE_FEEDS_FROM_FEEDSDB'))
  },
  retrieveIndividiualArticleCount ({commit}, feedid) {
    commit('HOIST_ARTICLE_COUNT', { 'count': ipcRenderer.sendSync('RETRIEVE_COUNT_FROM_ARTICLEDB', feedid), 'feedid': feedid })
  },
  setSelectedFeed ({commit}, feedid) {
    commit('SET_SELECTED_FEED', feedid)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
