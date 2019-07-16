// import test from 'tape'
// import ThunderJS from '../src/thunderJS'
// import sinon from 'sinon'

// const options = { host: 'localhost' }

// test('thunderJS - notifications - on-listener', assert => {
//   let thunderJS = ThunderJS(options)

//   // argument based
//   const listener1 = thunderJS.on('controller', 'statechange', () => {})
//   // object based
//   const listener2 = thunderJS.controller.on('statechange', () => {})

//   // should return an object
//   let expected = 'object'
//   let actual1 = typeof listener1
//   let actual2 = typeof listener2

//   assert.equal(
//     actual1,
//     expected,
//     'thunderJS.on should return a listener object (argument based invocation)'
//   )
//   assert.equal(
//     actual2,
//     expected,
//     'thunderJS.on should return a listener object (object based invocation)'
//   )

//   // should have a dispose method
//   expected = ['dispose']
//   actual1 = Object.keys(listener1).filter(key => {
//     // get the object keys that are a function
//     return typeof listener1[key] === 'function'
//   })
//   actual2 = Object.keys(listener2).filter(key => {
//     // get the object keys that are a function
//     return typeof listener2[key] === 'function'
//   })
//   assert.deepEqual(
//     actual1,
//     expected,
//     'listener object should have a dispose method  (argument based invocation)'
//   )
//   assert.deepEqual(
//     actual2,
//     expected,
//     'listener object should have a dispose method  (object based invocation)'
//   )

//   assert.end()
// })

// test('thunderJS - notifications - once-listener', assert => {
//   let thunderJS = ThunderJS(options)

//   // argument based
//   const listener1 = thunderJS.once('controller', 'statechange', () => {})
//   // object based
//   const listener2 = thunderJS.controller.once('statechange', () => {})

//   // should return an object
//   let expected = 'object'
//   let actual1 = typeof listener1
//   let actual2 = typeof listener2

//   assert.equal(
//     actual1,
//     expected,
//     'thunderJS.once should return a listener object (argument based invocation)'
//   )
//   assert.equal(
//     actual2,
//     expected,
//     'thunderJS.once should return a listener object (object based invocation)'
//   )

//   // should have a dispose method
//   expected = ['dispose']
//   actual1 = Object.keys(listener1).filter(key => {
//     // get the object keys that are a function
//     return typeof listener1[key] === 'function'
//   })
//   actual2 = Object.keys(listener2).filter(key => {
//     // get the object keys that are a function
//     return typeof listener2[key] === 'function'
//   })
//   assert.deepEqual(
//     actual1,
//     expected,
//     'listener object should have a dispose method  (argument based invocation)'
//   )
//   assert.deepEqual(
//     actual2,
//     expected,
//     'listener object should have a dispose method  (object based invocation)'
//   )

//   assert.end()
// })
