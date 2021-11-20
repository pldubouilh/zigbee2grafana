var CronJob = require('cron').CronJob;
const aedes = require('aedes')()
const fs = require('fs').promises;
const { exec } = require("child_process");

const port = 9123
const server = require('net').createServer(aedes.handle)

const state = {}

server.listen(port, function () {
  console.log(new Date(), 'mqtt started and listening on port ', port)
})

function set_heater(action, temp) {
  console.log(new Date(), "~~", action, temp)
  const payload = `{ "${action}": ${temp} }`
  const pkt = { topic: 'zigbee2mqtt/heater/set', payload };
  aedes.publish (pkt, m => console.log("heater replied, err:", m))
}


const calibrate = target => set_heater("local_temperature_calibration", target)
const heat_target = temp => set_heater("current_heating_setpoint", temp)

  // init
setTimeout(() => {
  calibrate(-5)
  heat_target(21.5)
}, 5000)

new CronJob('5 6 * * *',  () => heat_target(21.5), null, true, 'Europe/Berlin').start()
new CronJob('5 23 * * *', () => heat_target(12),   null, true, 'Europe/Berlin').start()


// also supports
// aedes.on('subscribe', function (subscriptions, client) {
// aedes.on('unsubscribe', function (subscriptions, client) {
// aedes.on('client', function (client) {
// aedes.on('clientDisconnect', function (client) {

aedes.on('publish', async function (packet, client) {
  if (packet.topic.includes('zigbee2mqtt/bridge/')) { return }

  try {
    let device = packet.topic.replace('zigbee2mqtt/', '')
    let pl = JSON.parse(packet.payload.toString())
    state[device] = pl
  } catch (error) { return }


  // console.log('Client ' + (client ? client.id : 'BROKER_' + aedes.id) + ' has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
})

let ip_server = "" // set dest ip here if needed

setInterval(async () => {
  // write state file
  await fs.writeFile('/ownstate.json', JSON.stringify(state, null, 2));

  // push data to server if setup
  if (ip_server.length > 0) {
    exec(`scp -qi ~/.ssh/key /ownstate.json ${ip_server}:/root/ownstate.json`, (error, stdout, stderr) => {
      console.log(new Date(), 'copy to server, err: ', error, stderr)
    })
  }
}, 15 * 1000)
