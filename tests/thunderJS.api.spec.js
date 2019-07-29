import test from 'tape'
import sinon from 'sinon'

import ThunderJS from '../src/thunderJS'
import * as API from '../src/api/index'
import * as ws from 'isomorphic-ws'

let wsStub

test('Setup - thunderJS - api', assert => {
  wsStub = sinon.stub(ws, 'default').callsFake(address => {
    return {
      addEventListener() {},
    }
  })

  assert.end()
})

test('makeWebsocketAddress - unit test', assert => {
  const address = API.makeWebsocketAddress()
  const address2 = API.makeWebsocketAddress({
    host: '192.168.1.100',
    port: 2020,
    endpoint: '/api',
    protocol: 'wss://',
  })

  assert.equals(
    address,
    'ws://localhost:80/jsonrpc',
    'makeWebsocketAddress should return default addresss without options'
  )
  assert.equals(
    address2,
    'wss://192.168.1.100:2020/api',
    'makeWebsocketAddress should return customized addresss when options are passed'
  )

  assert.end()
})

test('thunderJS - api - custom websocket connection', assert => {
  wsStub.resetHistory()

  const options = {
    host: '192.168.1.100',
    port: 2020,
    endpoint: '/api',
    protocol: 'wss://',
  }
  let thunderJS = ThunderJS(options)

  // make a call, to initiate a (stubbed) websocket connection
  thunderJS.DeviceInfo.systeminfo()

  assert.ok(
    wsStub.calledWith('wss://192.168.1.100:2020/api'),
    'Websocket with default custom address should be initiated'
  )

  assert.end()
})

test('Teardown - thunderJS - api', assert => {
  wsStub.restore()

  assert.end()
})
