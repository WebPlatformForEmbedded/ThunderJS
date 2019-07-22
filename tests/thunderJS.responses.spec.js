import test from 'tape'
import sinon from 'sinon'

import ThunderJS from '../src/thunderJS'

const options = { host: 'localhost' }

const plugin = {
  success() {
    return new Promise((resolve, reject) => {
      resolve('😎')
    })
  },
  failure() {
    return new Promise((resolve, reject) => {
      reject('😭')
    })
  },
}

test('thunderJS - response - promise', assert => {
  let thunderJS = ThunderJS(options)

  thunderJS.registerPlugin('custom', {
    promise() {
      return new Promise((resolve, reject) => {})
    },
    value() {
      return 'hello!'
    },
    object() {
      return { hi: 'there' }
    },
    err() {
      return new Error('this is an error')
    },
  })

  // call promise method and see if it has a then function (as promises do)
  let actual = thunderJS.custom.promise().then
  assert.ok(actual, 'Calls on thunderJS should return a promise')

  // call value method and see if it has a then function (as promises do)
  actual = thunderJS.custom.value().then
  assert.ok(
    actual,
    'Calls on thunderJS should return a promise (even if the method only returns a value)'
  )

  actual = thunderJS.custom.object().then
  assert.ok(
    actual,
    'Calls on thunderJS should return a promise (even if the method returns an object literal)'
  )

  let result = thunderJS.custom.err()
  actual = result.then
  // handle the error properly
  result.catch(err => {})

  assert.ok(
    actual,
    'Calls on thunderJS should return a promise (even if the method returns an Error)'
  )

  assert.end()
})

test('thunderJS - response - then / catch', assert => {
  let thunderJS = ThunderJS(options)

  const successSpy = sinon.spy()
  const failureSpy = sinon.spy()

  thunderJS.registerPlugin('custom', plugin)

  assert.plan(2)

  thunderJS
    .call('custom', 'success')
    .then(successSpy)
    .catch(failureSpy)
    .finally(() => {
      assert.ok(successSpy.calledOnceWith('😎'), 'Success method should be called once')
    })

  thunderJS
    .call('custom', 'failure')
    .then(successSpy)
    .catch(failureSpy)
    .finally(() => {
      assert.ok(failureSpy.calledOnceWith('😭'), 'Failure method should be called once')
    })
})

test('thunderJS - response - passing callback', assert => {
  let thunderJS = ThunderJS(options)

  const callback = () => {}

  const callbackSpy = sinon.spy(callback)

  thunderJS.registerPlugin('custom', plugin)

  thunderJS.call('custom', 'success', callbackSpy)
  thunderJS.call('custom', 'failure', callbackSpy)

  // next tick
  setTimeout(() => {
    assert.ok(
      callbackSpy.calledWith(null, '😎'),
      'Callback should be called once with null as first param and success as second'
    )
    assert.ok(
      callbackSpy.calledWith('😭'),
      'Callback should be called once with only the error as first param'
    )
    assert.end()
  }, 0)
})