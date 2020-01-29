// defaults
const protocol = 'ws://'
const host = 'localhost'
const endpoint = '/jsonrpc'
const port = 80

export default options => {
  return [
    (options && options.protocol) || protocol,
    (options && options.host) || host,
    ':' + ((options && options.port) || port),
    (options && options.endpoint) || endpoint,
    options && options.token ? '?token=' + options.token : null,
  ].join('')
}
