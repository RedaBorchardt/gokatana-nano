const {ipcRenderer} = require('electron')

const state = {
  subscriptions: [],
  topicfilter: ''
}

const mutations = {
  HOIST_FEEDS_INTO_STATE (state, arg) {
    state.subscriptions = arg

    // HOIST The Default Article Count
    for (let i = 0; i < state.subscriptions.length; i++) {
      state.subscriptions[i].count = ipcRenderer.sendSync('RETRIEVE_COUNT_FROM_ARTICLEDB', state.subscriptions[i]._id)
    }
    ipcRenderer.send('FEEDS_STORE_IN_MAIN', state.subscriptions)
  },
  HOIST_ARTICLE_COUNT (state, arg) {
    if (!arg.rssname) {
      for (let i = 0; i < state.subscriptions.length; i++) {
        if (state.subscriptions[i]._id === arg.feedid) {
          state.subscriptions[i].count = arg.count
        }
      }
      state.subscriptions.push('update')
      state.subscriptions.pop()
      ipcRenderer.send('FEEDS_STORE_IN_MAIN', state.subscriptions)
    } else {
      for (let i = 0; i < state.subscriptions.length; i++) {
        if (state.subscriptions[i]._id === arg.feedid) {
          if (!state.subscriptions[i].subfeedcount) {
            state.subscriptions[i].subfeedcount = {}
            state.subscriptions[i].subfeedcount[arg.rssname] = arg.count
          } else {
            state.subscriptions[i].subfeedcount[arg.rssname] = arg.count
          }
        }
      }
      state.subscriptions.push('update')
      state.subscriptions.pop()
      ipcRenderer.send('FEEDS_STORE_IN_MAIN', state.subscriptions)
    }
  },
  SET_SELECTED_FEED (state, feedid) {
    for (let i = 0; i < state.subscriptions.length; i++) {
      state.subscriptions[i].selected = false
      if (state.subscriptions[i]._id === feedid) {
        state.subscriptions[i].selected = true
      }
    }
    state.topicfilter = '' // RESET THE SUBFEED TO NOTHING
    state.subscriptions.push('update')
    state.subscriptions.pop()
    ipcRenderer.send('FEEDS_STORE_IN_MAIN', state.subscriptions)
    require('electron').remote.BrowserWindow.fromId(1).webContents.send('NEW_FEED_SELECTED', true)
  },
  SET_SELECTED_SUBFEED (state, topicfilter) {
    state.topicfilter = topicfilter
  },
  UPDATE_FEED_ON_DROP (state, obj) {
    let x = obj.length
    for (let i = 0; i < x; i++) {
      obj[i].uiorder = i + 1
    }
    state.subscriptions = obj
    ipcRenderer.send('SAVE_NEW_FEEDS_UIORDER', state.subscriptions)
    ipcRenderer.send('FEEDS_STORE_IN_MAIN', state.subscriptions)
  },
  REDUCE_UNREAD_COUNT (state, feedid) {
    for (let i = 0; i < state.subscriptions.length; i++) {
      if (state.subscriptions[i]._id === feedid) {
        state.subscriptions[i].count -= 1
      }
    }
  }
}

const getters = {
  getFeeds (state) {
    return state.subscriptions
  },
  getTopicFilter (state) {
    return state.topicfilter
  }
}

const actions = {
  deleteFeeds ({commit, state}, arg) {
    ipcRenderer.sendSync('DELETE_FEEDS', arg)
    commit('HOIST_FEEDS_INTO_STATE', ipcRenderer.sendSync('RETRIEVE_FEEDS_FROM_FEEDSDB'))
  },
  retrieveAllFeeds ({commit}) {
    // To be implemented
  },
  retrieveFeedsFromBackend ({commit}) {
    commit('HOIST_FEEDS_INTO_STATE', ipcRenderer.sendSync('RETRIEVE_FEEDS_FROM_FEEDSDB'))
  },
  retrieveIndividiualArticleCount ({commit, dispatch}, feedid) {
    commit('HOIST_ARTICLE_COUNT', { 'count': ipcRenderer.sendSync('RETRIEVE_COUNT_FROM_ARTICLEDB', feedid), 'feedid': feedid })
  },
  countFeedChildItems ({commit, state}, index) {
    let upperlimit = state.subscriptions[index].rss.length
    if (upperlimit > 1) {
      for (let i = 0; i < upperlimit; i++) {
        commit('HOIST_ARTICLE_COUNT', { 'count': ipcRenderer.sendSync('RETRIEVE_SUBFEED_COUNT', state.subscriptions[index]._id, state.subscriptions[index].rss[i].name), 'feedid': state.subscriptions[index]._id, 'rssname': state.subscriptions[index].rss[i].name })
      }
    }
  },
  setSelectedFeed ({commit}, feedid) {
    commit('SET_SELECTED_FEED', feedid)
  },
  setSelectedSubFeed ({commit}, topicfilter) {
    commit('SET_SELECTED_SUBFEED', topicfilter)
  },
  updateFeedsListOnDrop ({commit}, obj) {
    commit('UPDATE_FEED_ON_DROP', obj)
  },
  reduceUnreadCount ({commit}, feedid) {
    commit('REDUCE_UNREAD_COUNT', feedid)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
