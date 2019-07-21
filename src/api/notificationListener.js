import { listeners } from '../store'

export default data => {
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
