import { ipcRenderer, remote } from 'electron'

const state = [{
  BUSY_FETCHINGARTICLES: remote.getGlobal('BUSY_FETCHINGARTICLES'),
  ONLINE_STATUS: remote.getGlobal('ONLINE_STATUS'),
  BLADEVIEWER: true,
  HEADLINEVIEWER: true,
  KATANAVIEWER: true,
  MOBILEVIEWER: false,
  MOBILEVIEWLINK: true,
  GTOPICVIEWER: false,
  GTOPICVIEWLINK: true,
  GTOPICMODE: 'DuckDuckGo',
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
  TOGGLE_GTOPIC_VIEW (state) {
    state[0].GTOPICVIEWER = !state[0].GTOPICVIEWER
  },
  TOGGLE_FORCEDMINIBROWSER (state) {
    state[0].FORCEDMINIBROWSER = !state[0].FORCEDMINIBROWSER
  },
  TOGGLE_MOBILELINKSTATE (state) {
    state[0].MOBILEVIEWLINK = !state[0].MOBILEVIEWLINK
  },
  TOGGLE_GTOPICLINKSTATE (state) {
    state[0].GTOPICVIEWLINK = !state[0].GTOPICVIEWLINK
  },
  TOGGLE_GTOPICMODE (state) {
    if (state[0].GTOPICMODE === 'DuckDuckGo') {
      state[0].GTOPICMODE = 'Google'
    } else {
      state[0].GTOPICMODE = 'DuckDuckGo'
    }
  },
  TOGGLE_KATANAVIEWER (state) {
    state[0].KATANAVIEWER = !state[0].KATANAVIEWER
  },
  TOGGLE_HEADLINEVIEWER (state) {
    state[0].HEADLINEVIEWER = !state[0].HEADLINEVIEWER
  },
  TOGGLE_BLADEVIEWER (state) {
    state[0].BLADEVIEWER = !state[0].BLADEVIEWER
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
    if (!state[0].MOBILEVIEWER) {
      state[0].MOBILEVIEWLINK = true // Toggle the link on if the mobile view is turn on
    }
    return state[0].MOBILEVIEWER
  },
  getGTopicViewState (state) {
    if (!state[0].GTOPICVIEWER) {
      state[0].GTOPICVIEWLINK = true // Toggle the link on if the mobile view is turn on
    }
    return state[0].GTOPICVIEWER
  },
  getForcedMiniBrowserState (state) {
    return state[0].FORCEDMINIBROWSER
  },
  getMobileViewLinkState (state) {
    return state[0].MOBILEVIEWLINK
  },
  getGTopicViewLinkState (state) {
    return state[0].GTOPICVIEWLINK
  },
  getGTopicMode (state) {
    return state[0].GTOPICMODE
  },
  getKatanaViewState (state) {
    return state[0].KATANAVIEWER
  },
  getHeadlineViewerState (state) {
    return state[0].HEADLINEVIEWER
  },
  getBladeViewerState (state) {
    return state[0].BLADEVIEWER
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
  toggleGTopicView ({commit}) {
    commit('TOGGLE_GTOPIC_VIEW')
  },
  toggleForcedMiniBrowser ({commit}) {
    commit('TOGGLE_FORCEDMINIBROWSER')
  },
  toggleMobileLinkState ({commit}) {
    commit('TOGGLE_MOBILELINKSTATE')
  },
  toggleGTopicLinkState ({commit}) {
    commit('TOGGLE_GTOPICLINKSTATE')
  },
  toggleKatanaViewer ({commit}) {
    commit('TOGGLE_KATANAVIEWER')
  },
  toggleHeadlineViewer ({commit}) {
    commit('TOGGLE_HEADLINEVIEWER')
  },
  toggleBladeViewer ({commit}) {
    commit('TOGGLE_BLADEVIEWER')
  },
  toggleGTopicMode ({commit}) {
    commit('TOGGLE_GTOPICMODE')
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
