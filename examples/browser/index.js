// initialization:
var thunderJS

var defaultHost = localStorage.getItem('host')
var host = prompt('Please inform the IP address of your STB', defaultHost || '192.168.')

localStorage.setItem('host', host)
thunderJS = ThunderJS({
  host: host,
})

function reboot() {
  log('Calling: Controller.harakiri')
  thunderJS.Controller.harakiri()
    .then(function(result) {
      log('Success', result)
    })
    .catch(function(error) {
      log('Error', error)
    })
}

function getSystemInfo() {
  log('Calling: DeviceInfo.systeminfo')
  thunderJS.DeviceInfo.systeminfo()
    .then(function(result) {
      log('Success', result)
    })
    .catch(function(error) {
      log('Error', error)
    })
}

function activeConnections() {
  log('Calling: Controller.links')
  thunderJS.Controller.links()
    .then(function(result) {
      log('Success', result)
    })
    .catch(function(error) {
      log('Error', error)
    })
}

function webKitConfiguration() {
  log('Calling: Controller.configuration@WebKitBrowser')
  thunderJS.Controller['configuration@WebKitBrowser']()
    .then(function(result) {
      log('Success', result)
    })
    .catch(function(error) {
      log('Error', error)
    })
}

function loadUrl(url) {
  log('Calling: WebKitBrowser.url', url)
  thunderJS.WebKitBrowser.url(url)
    .then(function(result) {
      log('Success', result)
    })
    .catch(function(error) {
      log('Error', error)
    })
}

function getUrl() {
  log('Calling: WebKitBrowser.url')
  thunderJS.WebKitBrowser.url()
    .then(function(result) {
      log('Success', result)
    })
    .catch(function(error) {
      log('Error', error)
    })
}

function log(msg, content) {
  var el = document.getElementById('log')
  var entry = '<p class="font-bold">' + msg + '</p>'

  if (content) {
    entry += '<pre class="border mt-4 mb-8 text-sm">' + JSON.stringify(content, null, 2) + '</pre>'
  }

  entry += '<hr class="border-b" />'

  el.innerHTML += entry
}
