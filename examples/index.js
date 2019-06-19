import Contra from 'contra'
import Chalk from 'chalk'

import ThunderJS from '../src/thunderJS'

const thunderJS = ThunderJS({ host: 'localhost:3030' })

const examples = [
  // promise based examples
  next => {
    log('Promised based examples')
    next()
  },
  next => {
    thunderJS.device
      .systeminfo()
      .then(result => {
        log('Full system info', result)
      })
      .catch(err => {
        log('oops we have an error', err.message)
      })
      .finally(next)
  },
  next => {
    thunderJS.device
      .freeRam()
      .then(result => {
        log('Free ram', result)
      })
      .catch(err => {
        log('oops we have an error', err.message)
      })
      .finally(next)
  },
  next => {
    thunderJS.device
      .version()
      .then(result => {
        log('Version', result)
      })
      .catch(err => {
        log('oops we have an error', err.message)
      })
      .finally(next)
  },
  next => {
    thunderJS.device
      .addresses()
      .then(result => {
        log('Addresses', result)
      })
      .catch(err => {
        log('oops we have an error', err.message)
      })
      .finally(next)
  },

  // callback examples
  next => {
    log('Callback based examples')
    next()
  },

  next => {
    thunderJS.device.version({}, (err, result) => {
      if (err) {
        log('oops we have an error', err.message)
      } else {
        log('The version is', result)
      }
      next()
    })
  },

  // invoke promise examples
  next => {
    log('Invoke style promise examples')
    next()
  },

  next => {
    thunderJS
      .call('device', 'version', {})
      .then(result => {
        log('The version is', result)
      })
      .catch(err => {
        log(err)
        log('oops we have an error', err.message)
      })
      .finally(next)
  },

  next => {
    thunderJS
      .call('device', 'systeminfo', {})
      .then(result => {
        log('Full system info', result)
      })
      .catch(err => {
        log(err)
        log('oops we have an error', err.message)
      })
      .finally(next)
  },

  // invoke callback examples
  next => {
    log('Invoke style callback examples')
    next()
  },

  next => {
    thunderJS.call('device', 'version', {}, (err, result) => {
      if (err) {
        log('oops we have an error', err.message)
      } else {
        log('The version is', result)
      }
      next()
    })
  },

  // custom plugin
  next => {
    log('Custom plugin examples')
    next()
  },

  next => {
    thunderJS.registerPlugin('custom', {
      hello() {
        return this.call('hello')
      },
    })

    thunderJS.custom
      .hello()
      .then(log)
      .catch(err => log('we have an error', err.message))
      .finally(next)
  },
]

Contra.series(examples, () => {
  log('All examples done')
})

const log = (...args) => {
  args.unshift(Chalk.cyan('--------------------------- CLIENT ---------------------------\n'))
  console.log.apply(this, args)
  console.log(Chalk.cyan('--------------------------------------------------------------'))
}
