import {ipcRenderer} from 'electron'

const state = {
  inview: []
}

const mutations = {
  HOIST_ARTICLES_INTO_STATE (state, feedid) {
    state.inview = ipcRenderer.sendSync('RETRIEVE_ARTICLES', feedid)
  },
  HOIST_SUBFEED_ARTICLES_INTO_STATE (state, arg) {
    state.inview = ipcRenderer.sendSync('RETRIEVE_SUBFEED_ARTICLES', arg.feedid, arg.topicfilter)
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
  },
  MARK_ARTICLE_AS_READ (state, articleid) {
    for (let i = 0; i < state.inview.length; i++) {
      if (state.inview[i]._id === articleid) {
        state.inview[i].read = true
      }
    }
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
  retrieveSubfeedArticle ({commit}, arg) {
    commit('HOIST_SUBFEED_ARTICLES_INTO_STATE', arg)
  },
  setSelectedArticle ({commit}, articleid) {
    commit('SET_SELECTED_ARTICLE', articleid)
  },
  markArticleAsRead ({commit}, articleid) {
    commit('MARK_ARTICLE_AS_READ', articleid)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
