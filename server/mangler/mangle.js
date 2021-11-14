const fsPromise = require('fs').promises
const http = require('http')

// optionally set nickname for sensors here
const sensors = {
  '0xaaaaaaaaaaaaa': 'living_room_temp',
  '0xbbbbbbbbbbbbb': 'kitchen_temp'
}

async function mangleState () {
  let ret = ''
  const state = await fsPromise.readFile('/state.json')
  const stateObj = JSON.parse(state)

  Object.keys(stateObj).forEach((key) => {
    const nick = sensors[key] === undefined ? key : sensors[key]

    Object.entries(stateObj[key]).forEach(([key, value]) => {
      let val = value === false ? 0 : value === true ? 1 : value
      ret += nick + '_' + key + '{} ' + val + '\n'
    })
  })

  return ret
}

console.log('starting mangler')

http.createServer()
  .listen(9123, '0.0.0.0')
  .on('request', async (req, res) => {
    const data = await mangleState()
    res.end(data)
  })
