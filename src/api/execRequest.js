import { connect } from './index'

export default (options, body) => {
  connect(options)
    .then(connection => {
      connection.send(JSON.stringify(body))
    })
    .catch(console.error)
}
