import test from 'tape'
import sinon from 'sinon'

import ThunderJS from '../src/thunderJS'

const options = { host: 'localhost' }

const plugin = {
  foo() {},
  bar() {},
}

const fooSpy = sinon.spy(plugin, 'foo')
const barSpy = sinon.spy(plugin, 'bar')

test('thunderJS - call - custom plugin - argument based', assert => {
  let thunderJS = ThunderJS(options)

  fooSpy.resetHistory()
  barSpy.resetHistory()

  thunderJS.registerPlugin('custom', plugin)

  // make calls using argument style
  thunderJS.call('custom', 'foo')
  thunderJS.call('custom', 'bar')

  assert.ok(fooSpy.calledOnce, 'Should call the foo method on the custom plugin')
  assert.ok(barSpy.calledOnce, 'Should call the bar method on the custom plugin')

  assert.end()
})

test('thunderJS - call - custom plugin - object based', assert => {
  let thunderJS = ThunderJS(options)

  fooSpy.resetHistory()
  barSpy.resetHistory()

  thunderJS.registerPlugin('custom', plugin)

  // make calls using object style
  thunderJS.custom.foo()
  thunderJS.custom.bar()

  assert.ok(fooSpy.calledOnce, 'Should call the foo method on the custom plugin')
  assert.ok(barSpy.calledOnce, 'Should call the bar method on the custom plugin')

  assert.end()
})
