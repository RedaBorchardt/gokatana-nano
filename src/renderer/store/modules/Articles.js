import {ipcRenderer} from 'electron'

const state = {
  inview: []
}

const mutations = {
  HOIST_ARTICLES_INTO_STATE (state, feedid) {
    state.inview = ipcRenderer.sendSync('RETRIEVE_ARTICLES', feedid)
  },
  SET_SELECTED_ARTICLE (state, articleid) {
    for (let i = 0; i < state.inview.length; i++) {
      state.inview[i].selected = false
      if (state.inview[i]._id === articleid) {
        state.inview[i].selected = true
      }
    }
    state.inview.push('update')
    state.inview.pop()
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
  },
  setSelectedArticle ({commit}, articleid) {
    commit('SET_SELECTED_ARTICLE', articleid)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
