# ThunderJS

A flexible and extensible JS library to interact with WPE Thunder.

**Work in Progress!**

## Getting started

1. Clone this repository (`prototype` branch)
2. Run `npm install` to install the project's dependencies
3. Run `npm start`, this will
   1. Fire up a rudimentary mock server to replicate WPE Thunder jsonrpc responses (run separately with `npm run server`)
   2. Run the set of examples of how to interact with WPE Thunder through the ThunderJS library (run separately with `npm run examples`)

## Basics

The goal of ThunderJS is to
1) make API calls to the WPE Thunder back-end and
2) listen to (and act upon) notifications broadcasted by the back-end (todo).

### Initializing the library

```js
import ThunderJS from './thunderJS' // or const ThunderJS = require('./thunderJS')

const thunderJS = ThunderJS({ host: 'localhost:3030' })
```

### Making API calls

In essence all API calls are made up of the following components:

- plugin (i.e. `controller` or `device`)
- method (i.e `activate` or `systeminfo`)
- params (`{foo: 'bar'}`, optional)

The library supports 2 ways of making API calls, depending on your coding style preferences.

**Option 1 - Argument based**

```js
const plugin = 'device'
const method = 'systeminfo'
const params = {
  foo: 'bar'
}

thunderJS.call(plugin, method, params)
```

**Option 2 - Object based**

```js
const params = {
  foo: 'bar'
}

thunderJS.device.systeminfo(params)
```

### Processing the result of an API call

When an API call is made it can return a `result` in case of success or an `error`.

The library supports 2 ways of processing the results of API calls, depending on your coding style preferences.

**Option 1 - Promise based**

```js
thunderJS.device.systeminfo()
  .then(result => {
    console.log('Success!', result)
  }).catch(err => {
    console.error('Error', err)
  })
```

**Option 2 - Callback based**

```js
thunderJS.device.systeminfo((err, result) => {
  if(err) {
    console.error('Error', err)
  }
  else {
    console.log('Success!', result)
  }
})
```

> Note that in these examples the _object based_ style of calling was used. But both ways of processing the result of an API call work with _argument based_ style as well.

### Plugin helper methods

Besides calling the available WPE Thunder API methods and returning the result, ThunderJS can also implement extra helper methods.

For example, the WPE Thunder API for the `device` plugin consists of only 3 methods (`systeminfo`, `addresses` and `socketinfo`).

On top of that the ThunderJS library implements 2 convenience methods to retrieve the `version` and `freeRam` directly (which ultimately are retrieved from the API by calling the `systeminfo` method).

```js
thunderJS.device
  .freeRam()
  .then(ram => {
    log('Free ram', ram)
  })
  .catch(err => {
    console.error('Error', err)
  })
```

### Custom plugins

You can easily implement custom plugins. A plugin consists of a plain JS object literal, that should be registered under the plugin's namespace.

```js
// register the plugin
thunderJS.registerPlugin('custom', {
  method1() {
    return this.call('foo', {foo:bar})
  },
  method2() {
    return this.call('bar').then(result => {
      return result.bla
    })
  },
})

// call a method on the plugin
thunderJS.custom.method1()
  .then(console.log)
  .catch(console.error)
```

### Notifications

**Proposal - work in progress**

The simplest way to listen to and act upon a notification:

```js
const listener = thunderJS.on('controller', 'statechange', (event) => {
  console.log('Execute this callback on every notification', event)
})

// dispose when done listening
listener.dispose()
```

Or if you want to listen only once
```js
const listener = thunderJS.once('controller', 'statechange', (event) => {
  console.log('Execute this callback once', event)
})

// a once-listener can be disposed (before it's called, of course)
listener.dispose()
```

As with API calls, you can also use *object based* style to achieve the same result.

```js
const listener = thunderJS.controller.on('statechange', (event) => {
  console.log('Execute this callback on every notification', event)
})
```

```js
const listener = thunderJS.controller.once('statechange', (event) => {
  console.log('Execute this callback once', event)
})
```

You can attach multiple callbacks (listeners) to the same notification. They will be executed in sequence.

```js
const listener1 = thunderJS.controller.on('statechange', (event) => {
  console.log('First callback!', event)
})

const listener2 = thunderJS.controller.on('statechange', (event) => {
  console.log('Second callback!', event)
})
```

If you want / need more control - for example because you need multiple listeners and want to keep track of them - you could also create a _subscription_.

```js
const subscription = thunderJS.subscribe('controller') // or thunderJS.controller.subscribe()

const listener = subscription.on('statechange', (event) => {
  console.log('Execute this callback on every notification', event)
})

const listenerOnce = subscription.once('statechange', (event) => {
  console.log('Execute this callback on time', event)
})

// dispose listener when done listening
listener.dispose()

// return all listeners
const listeners = subscription.listeners()

// dispose all listeners
subscription.disposeAll()

// unsubscribe the subscription to stop acting upon incoming notifications (but keep track of the listeners!)
subscription.unsubscribe()

// subscribe to the notifications again (activating all listeners that weren't disposed of)
subscription.subscribe()

// dispose the subscription (together with all listeners)
subscription.dispose()
```

## Running tests

This library has a handful of unit / integration tests, located in the `tests` folder.

To run all the tests execute: `npm test`
