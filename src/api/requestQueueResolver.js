import { requestsQueue } from '../store'

export default data => {
  if (typeof data === 'string') {
    data = JSON.parse(data.normalize().replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ''))
  }
  if (data.id) {
    const request = requestsQueue[data.id]
    if (request) {
      // result can also be null, that's why we check for the existence of the key
      if ('result' in data) request.resolve(data.result)
      else request.reject(data.error)
      delete requestsQueue[data.id]
    } else {
      console.log('no pending request found with id ' + data.id)
    }
  }
}
