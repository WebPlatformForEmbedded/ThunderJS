const device = method => {
  let result

  switch (method) {
    case 'systeminfo':
      result = {
        version: '1.0#14452f612c3747645d54974255d11b8f3b4faa54',
        uptime: 120,
        totalram: 655757312,
        freeram: 563015680,
        devicename: 'buildroot',
        cpuload: '2',
        totalgpuram: 381681664,
        freegpuram: 358612992,
        serialnumber: 'WPEuCfrLF45',
        deviceid: 'WPEuCfrLF45',
        time: 'Mon, 11 Mar 2019 14:38:18',
      }
      break
    case 'addresses':
      result = [
        {
          name: 'lo',
          mac: '00:00:00:00:00',
          ip: ['127.0.0.1'],
        },
      ]
      break
    case 'socketinfo':
      result = {
        total: 0,
        open: 0,
        link: 0,
        exception: 0,
        shutdown: 0,
        runs: 1,
      }
      break
  }

  return result
}

export default device
