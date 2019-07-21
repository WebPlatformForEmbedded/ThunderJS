export default (requestId, plugin, method, params, version) => {
  // delete possible version key from params
  params ? delete params.version : null
  const body = {
    jsonrpc: '2.0',
    id: requestId,
    method: [plugin, version, method].join('.'),
  }

  // params exist (or explicitely false)
  params || params === false
    ? // params is not an empty object, or it is a boolean or a number
      typeof params === 'object' && Object.keys(params).length === 0
      ? null
      : (body.params = params)
    : null
  return body
}
