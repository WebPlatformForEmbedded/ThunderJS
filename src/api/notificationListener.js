import { listeners } from '../store'

export default data => {
  if (typeof data === 'string') {
    data = JSON.parse(data.normalize().replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ''))
  }
  // determine if we're dealing with a notification
  if (!data.id && data.method) {
    // if so, so see if there exist callbacks
    const callbacks = listeners[data.method]
    if (callbacks && Array.isArray(callbacks) && callbacks.length) {
      callbacks.forEach(callback => {
        callback(data.params)
      })
    } else {
      console.log('no callbacks for ' + data.method)
    }
  }
}
