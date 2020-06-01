if (typeof window === 'undefined') {
  if (!global.fetch) {
    // tslint:disable-next-line: no-var-requires
    const nodeFetch = require('node-fetch')
    const fetch = function fetchPolyfill(this: any, url, options) {
      if (/^\/\//.test(url)) {
        url = 'https:' + url
      }
      return nodeFetch.call(this, url, options)
    }

    global.fetch = fetch
    global.Response = nodeFetch.Response
    global.Headers = nodeFetch.Headers
    global.Request = nodeFetch.Request
  }
} else {
  // tslint:disable-next-line: no-var-requires
  require('whatwg-fetch')
}
