import { makeBody, getVersion, makeId, execRequest } from './api/index'
import { requestsQueue } from './store'

export default options => {
  return {
    request(plugin, method, params) {
      return new Promise((resolve, reject) => {
        const requestId = makeId()
        const version = getVersion(options.versions, plugin, params)
        const body = makeBody(requestId, plugin, method, params, version)

        if (options.debug) {
          console.log(' ')
          console.log('API REQUEST:')
          console.log(JSON.stringify(body, null, 2))
          console.log(' ')
        }

        requestsQueue[requestId] = {
          body,
          resolve,
          reject,
        }

        execRequest(options, body)
      })
    },
  }
}
