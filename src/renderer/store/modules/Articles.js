import {ipcRenderer} from 'electron'

const state = {
  inview: []
}

const mutations = {
  HOIST_ARTICLES_INTO_STATE (state, feedid) {
    state.inview = ipcRenderer.sendSync('RETRIEVE_ARTICLES', feedid)
  }
}

const getters = {
  getArticlesInView (state) {
    return state.inview
  }
}

const actions = {
  retrieveArticles ({commit}, feedid) {
    commit('HOIST_ARTICLES_INTO_STATE', feedid)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
