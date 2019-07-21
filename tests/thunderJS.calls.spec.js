import test from 'tape'
import sinon from 'sinon'

import ThunderJS from '../src/thunderJS'
import * as API from '../src/api/index'

const options = { host: 'localhost' }

const makeBodySpy = sinon.spy(API, 'makeBody')
const apiRequestSpy = sinon.spy(API, 'execRequest')

const connectStub = sinon.stub(API, 'connect').callsFake(() => {
  return new Promise(resolve => {
    resolve({
      // stubbed send
      send() {},
    })
  })
})

const resetStubsAndSpies = () => {
  connectStub.resetHistory()
  apiRequestSpy.resetHistory()
  makeBodySpy.resetHistory()
}

test('thunderJS - call - argument based', assert => {
  resetStubsAndSpies()

  let thunderJS = ThunderJS(options)

  // make call using argument style
  thunderJS.call('DeviceInfo', 'systeminfo')

  assert.ok(
    makeBodySpy.returned(
      sinon.match({
        jsonrpc: '2.0',
        id: 1,
        method: 'DeviceInfo.1.systeminfo',
      })
    ),
    'Should make a jsonrpc body with id 1 and method DeviceInfo.1.systeminfo'
  )

  assert.deepEquals(
    apiRequestSpy.firstCall.args[1],
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'DeviceInfo.1.systeminfo',
      params: ['DeviceInfo', 'systeminfo'], // this is wrong!!
    },
    'Should make a request for DeviceInfo.1.systeminfo'
  )

  assert.end()
})

test('thunderJS - call - object based', assert => {
  resetStubsAndSpies()

  let thunderJS = ThunderJS(options)

  // make call using object style
  thunderJS.DeviceInfo.systeminfo()

  assert.ok(
    makeBodySpy.returned(
      sinon.match({
        jsonrpc: '2.0',
        id: 2,
        method: 'DeviceInfo.1.systeminfo',
      })
    ),
    'Should make a request for DeviceInfo.1.systeminfo'
  )

  assert.deepEquals(
    apiRequestSpy.firstCall.args[1],
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'DeviceInfo.1.systeminfo',
    },
    'Should make a request for DeviceInfo.1.systeminfo'
  )

  assert.end()
})

test('thunderJS - call - specifying method versions', assert => {
  resetStubsAndSpies()

  let config = {
    ...options,
    versions: {
      default: 2,
      DeviceInfo: 3,
    },
  }

  let thunderJS = ThunderJS(config)

  // default version from config
  thunderJS.Controller.activate('DeviceInfo')
  assert.ok(
    makeBodySpy.firstCall.returned(sinon.match({ method: 'Controller.2.activate' })),
    'Body of request should specify method with the version defined as default in config'
  )

  // specified plugin version in config
  thunderJS.DeviceInfo.systeminfo()
  assert.ok(
    makeBodySpy.secondCall.returned(sinon.match({ method: 'DeviceInfo.3.systeminfo' })),
    'Body of request should specify method the version of the plugin in config'
  )

  // version passed as argument
  thunderJS.DeviceInfo.systeminfo({ version: 10 })
  assert.ok(
    makeBodySpy.thirdCall.returned(sinon.match({ method: 'DeviceInfo.10.systeminfo' })),
    'Body of request should specify method with the version as passed in params'
  )

  assert.end()
})

test('thunderJS - call - argument based - with params', assert => {
  resetStubsAndSpies()

  console.log('options!!', options)
  let thunderJS = ThunderJS(options)

  // make call using argument style
  thunderJS.call('Controller', 'activate', {
    callsign: 'DeviceInfo',
  })

  assert.ok(
    makeBodySpy.returned(
      sinon.match({
        jsonrpc: '2.0',
        id: 6,
        method: 'Controller.1.activate',
        params: {
          callsign: 'DeviceInfo',
        },
      })
    ),
    'Should make a jsonrpc body with id 6 and method Controller.1.activate'
  )

  assert.deepEquals(
    apiRequestSpy.firstCall.args[1],
    {
      jsonrpc: '2.0',
      method: 'Controller.1.activate',
      id: 6,
      params: {
        callsign: 'DeviceInfo',
      },
    },
    'Should make a request for Controller.1.activate, with params'
  )

  assert.end()
})

test('thunderJS - call - object style - with params', assert => {
  resetStubsAndSpies()

  let thunderJS = ThunderJS(options)

  // make call using object style
  thunderJS.Controller.activate({
    callsign: 'DeviceInfo',
  })

  assert.ok(
    makeBodySpy.returned(
      sinon.match({
        jsonrpc: '2.0',
        method: 'Controller.1.activate',
        id: 7,
        params: {
          callsign: 'DeviceInfo',
        },
      })
    ),
    'Should make a jsonrpc body with id 7 and method Controller.1.activate'
  )

  assert.deepEquals(
    apiRequestSpy.firstCall.args[1],
    {
      jsonrpc: '2.0',
      method: 'Controller.1.activate',
      id: 7,
      params: {
        callsign: 'DeviceInfo',
      },
    },
    'Should make a request for Controller.1.activate, with params'
  )

  assert.end()
})
