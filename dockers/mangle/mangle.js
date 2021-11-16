const fsPromise = require('fs').promises
const http = require('http')

const is_true  = val => val === "ON" || val === "on" || val === true || val === "LOCK"
const is_false = val => val === "OFF" || val === "off" || val === false || val == "UNLOCK"

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
    const nick = sensors[key] === undefined ? "xx"+key : sensors[key] // if no nickname, prepend with xx to avoid upset prometheus

    Object.entries(stateObj[key]).forEach(([key, value]) => {
      let val = is_false(value) ? 0 : is_true(value) ? 1 : value
      let label = ""

      if (isNaN(val)) {
        return // for now
        // label = `label=${val}`
        // val = 1
      }

      ret += `${nick}_${key}{${label}} ${val}\n`
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
