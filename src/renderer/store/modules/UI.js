import { ipcRenderer, remote } from 'electron'

const state = [{
  IS_FULLSCREEN: remote.getCurrentWindow().isFullScreen(),
  BUSY_FETCHINGARTICLES: remote.getGlobal('BUSY_FETCHINGARTICLES'),
  BUSY_COMPACTING: remote.getGlobal('BUSY_COMPACTING'),
  ONLINE_STATUS: remote.getGlobal('ONLINE_STATUS'),
  BLADEVIEWER: true,
  HEADLINEVIEWER: true,
  KATANAVIEWER: true,
  MOBILEVIEWER: false,
  MOBILEVIEWLINK: true,
  GTOPICVIEWER: false,
  GTOPICVIEWLINK: true,
  GTOPICMODE: 'DuckDuckGo',
  FORCEDMINIBROWSER: false,
  LIGHTSOUT: false
}]

const mutations = {
  TOGGLE_LIGHTSOUT (state) {
    state[0].LIGHTSOUT = !state[0].LIGHTSOUT
  },
  TOGGLE_FULLSCREEN (state, arg) {
    state[0].IS_FULLSCREEN = arg
  },
  BUSY_FETCHINGARTICLES (state, arg) {
    state[0].BUSY_FETCHINGARTICLES = arg
  },
  BUSY_COMPACTING (state, arg) {
    state[0].BUSY_COMPACTING = arg
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
  getIsFullscreen (state) {
    return state[0].IS_FULLSCREEN
  },
  getBusyFetchingArticles (state) {
    return state[0].BUSY_FETCHINGARTICLES
  },
  getBusyCompacting (state) {
    return state[0].BUSY_COMPACTING
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
  },
  getLightsOutState (state) {
    return state[0].LIGHTSOUT
  }
}

const actions = {
  toggleFullScreen ({commit}) {
    remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen())
    commit('TOGGLE_FULLSCREEN', remote.getCurrentWindow().isFullScreen())
  },
  toggleFullScreenFromVideo ({commit, state}) {
    remote.getCurrentWindow().setFullScreen(state[0].IS_FULLSCREEN)
    commit('TOGGLE_FULLSCREEN', remote.getCurrentWindow().isFullScreen())
  },
  checkIfBackendIsBusyFetchingArticles ({commit}) {
    ipcRenderer.on('BUSY_FETCHINGARTICLES', function (event, arg) {
      commit('BUSY_FETCHINGARTICLES', arg)
    })
  },
  checkIfBackendIsBusyCompacting ({commit}) {
    ipcRenderer.on('BUSY_COMPACTING', function (event, arg) {
      commit('BUSY_COMPACTING', arg)
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
  },
  toggleLightsOut ({commit}) {
    commit('TOGGLE_LIGHTSOUT')
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
