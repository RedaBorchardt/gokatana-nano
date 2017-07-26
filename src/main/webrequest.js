import { session } from 'electron'
/* eslint-disable */
var newHeader = {
  referer: {
    name: 'Referer',
    value: 'https://www.facebook.com'
  },
  cookie: {
    name: 'Cookie',
    value: ''
  },
  cacheControl: {
    name: 'Cache-Control',
    value: 'max-age=0'
  },
  useragent: {
    name: 'User-Agent',
    value: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.121 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/35.0.0.48.273;]'
  }
}

var sites = {
  wsj: {
    url: '*://*.wsj.com/*',
    js: '*.://*/*cxense-candy.js' // causing a pop up ad
  },
  ft: {
    url: '*://*.ft.com/*'
  },
  nyt: {
    js: '*://*.com/*mtr.js' // pop for subscription
  }
}

let filterAfter = {
  urls: [sites.wsj.url, sites.ft.url, sites.nyt.js]
}

session.defaultSession.webRequest.onBeforeRequest(['*'],function (details, callback) {
  let blocklist = /cxense-candy.js|mtr.js/gi
  if (blocklist.test(details.url)) {
    console.log('BINGO')
    callback({cancel: true})
  } else {
    callback({cancel: false})
  }
})

session.defaultSession.webRequest.onBeforeSendHeaders(filterAfter, function (details, callback) {
  // remove existing referer and cookie
  for (var i = 0; i < details.requestHeaders.length; i++) {
    if (details.requestHeaders[i].name === newHeader.referer.name || details.requestHeaders[i].name === newHeader.cookie.name) {
      details.requestHeaders.splice(i, 1)
      i--
    }
  }

  // add new referer
  details.requestHeaders['User-agent'] = 'newHeader.useragent.value'
  // add new user agent
   details.requestHeaders['Referer'] = newHeader.referer.value
  // remove cache
   details.requestHeaders['cacheControl'] = newHeader.cacheControl.value
   details.requestHeaders['Cookie'] = newHeader.cacheControl.value
  callback({cancel: false, requestHeaders: details.requestHeaders})
})
