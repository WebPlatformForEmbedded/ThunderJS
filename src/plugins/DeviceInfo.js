export default {
  freeRam(params) {
    return this.call('systeminfo', params).then(res => {
      return res.freeram
    })
  },
  version(params) {
    return this.call('systeminfo', params).then(res => {
      return res.version
    })
  },
}
