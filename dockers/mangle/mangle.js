const fsPromise = require('fs').promises
const http = require('http')

const is_true  = val => val === "ON" || val === "on" || val === true || val === "LOCK"
const is_false = val => val === "OFF" || val === "off" || val === false || val == "UNLOCK"

async function mangleState () {
  let ret = ''
  const state = await fsPromise.readFile('/ownstate.json')
  const stateObj = JSON.parse(state)

  Object.keys(stateObj).forEach((id) => {
    Object.entries(stateObj[id]).forEach(([key, value]) => {
      let val = is_false(value) ? 0 : is_true(value) ? 1 : value
      if (isNaN(val)) {
        return
      }
      let pl = `${id}_${key}{} ${val}\n`
      ret += pl.replace("/", "_")
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
