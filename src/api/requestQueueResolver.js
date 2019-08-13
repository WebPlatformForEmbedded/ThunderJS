import { requestsQueue } from '../store'

export default data => {
  if (typeof data === String) {
    try {
      data = JSON.parse(data.normalize())
    } catch (e) {
      console.log('Unable to parse data')
    }
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
