import test from 'tape'
import ThunderJS from '../src/thunderJS'

const options = { host: 'localhost' }

test('ThunderJS lib - Type', assert => {
  let expected = 'function'
  let actual = typeof ThunderJS

  assert.equal(actual, expected, 'ThunderJS (library) should return a (factory) function')
  assert.end()
})

test('thunderJS instance - Type', assert => {
  // initialize the lib
  let thunderJS = ThunderJS(options)

  let expected = 'object'
  let actual = typeof thunderJS

  assert.equal(actual, expected, 'thunderJS (instance) should return an object')
  assert.end()
})

test('thunderJS instance - Methods', assert => {
  let thunderJS = ThunderJS(options)

  let expected = ['call', 'registerPlugin', 'subscribe', 'on', 'once']
  let actual = Object.keys(thunderJS).filter(key => {
    // get the object keys that are a function
    return typeof thunderJS[key] === 'function'
  })

  assert.deepEqual(actual, expected, 'thunderJS (instance) should have all expected methods')
  assert.end()
})

test('thunderJS - device plugin', assert => {
  let thunderJS = ThunderJS(options)

  let expected = 'object'
  let actual = typeof thunderJS.device

  assert.equal(actual, expected, 'thunderJS should have a `device` key that returns an `object`')

  expected = ['freeRam', 'version']
  actual = Object.keys(thunderJS.device).filter(key => {
    // get the object keys that are a function
    return typeof thunderJS.device[key] === 'function'
  })

  assert.deepEqual(actual, expected, 'device plugin should have all the methods')
  assert.end()
})

test('thunderJS - register custom plugin', assert => {
  let thunderJS = ThunderJS(options)

  thunderJS.registerPlugin('custom', {
    foo() {},
  })

  let expected = 'object'
  let actual = typeof thunderJS.custom

  assert.equal(actual, expected, 'custom plugin should be available as a key on thunderJS')

  expected = 'function'
  actual = typeof thunderJS.custom.foo

  assert.equal(
    actual,
    expected,
    'custom plugin method should be available on thunderJS under the plugin "namespace"'
  )

  assert.end()
})

test('thunderJS - calling plugin that is not registered', assert => {
  let thunderJS = ThunderJS(options)

  const plugin = thunderJS.pluginxyz

  let expected = 'object'
  let actual = typeof plugin

  assert.equal(
    actual,
    expected,
    'accessing an unregistered plugin should return a thunderJS object'
  )

  expected = 'function'
  actual = typeof plugin.call

  assert.equal(actual, expected, 'thunderJS object should have a call method')

  assert.end()
})
