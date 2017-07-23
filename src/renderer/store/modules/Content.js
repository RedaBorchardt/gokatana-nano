import { ipcRenderer } from 'electron'

const state = {
  inview: [{}]
}

const mutations = {
  UPLOAD_UNFLUFF_CONTENT_INTO_STATE (state, obj) {
    state.inview[0].title = obj.content.title
    state.inview[0].date = obj.content.date
    state.inview[0].author = obj.content.author
    state.inview[0].copyright = obj.content.copyright
    state.inview[0].image = obj.content.image
    state.inview[0].text = obj.content.text
    state.inview[0].links = obj.content.links
    state.inview[0].originalLink = obj.content.originalLink
    state.inview[0].displaystrategy = obj.content.displaystrategy
    state.inview[0].miniuseragent = obj.content.miniuseragent

    state.inview.push('udpate')
    state.inview.pop()
  },
  UPLOAD_DOJO_CONTENT_INTO_STATE (state, obj) {
    state.inview[0].dojoTitle = obj.content.title
    state.inview[0].dojoHTML = obj.content.html
    state.inview[0].originalLink = obj.content.originalLink

    state.inview.push('udpate')
    state.inview.pop()
  }
}

const getters = {
  getContentInView () {
    return state.inview[0]
  }
}

const actions = {
  listenForContentFromBackend ({commit}) {
    ipcRenderer.on('PARSED_ARTICLE_READY', function (event, obj) {
      if (obj.doctype === 'unfluff') {
        commit('UPLOAD_UNFLUFF_CONTENT_INTO_STATE', obj)
      }
      if (obj.doctype === 'dojo') {
        commit('UPLOAD_DOJO_CONTENT_INTO_STATE', obj)
      }
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
