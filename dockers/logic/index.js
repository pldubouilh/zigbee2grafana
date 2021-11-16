var CronJob = require('cron').CronJob;
const aedes = require('aedes')()

const port = 9123
const server = require('net').createServer(aedes.handle)

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
  calibrate(-4)
  heat_target(22)
}, 5000)

new CronJob('5 6 * * *',  () => heat_target(21.5), null, true, 'Europe/Berlin').start()
new CronJob('5 23 * * *', () => heat_target(15),   null, true, 'Europe/Berlin').start()


// /state.json contains the current state of the sensors

// aedes.on('subscribe', function (subscriptions, client) {
//   console.log('MQTT client ' + (client ? client.id : client) +
//           ' subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
// })

// aedes.on('unsubscribe', function (subscriptions, client) {
//   console.log('MQTT client ' + (client ? client.id : client) +
//           ' unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
// })

// // fired when a client connects
// aedes.on('client', function (client) {
//   console.log('Client Connected: ' + (client ? client.id : client), 'to broker', aedes.id)
// })

// // fired when a client disconnects
// aedes.on('clientDisconnect', function (client) {
//   console.log('Client Disconnected: ' + (client ? client.id : client), 'to broker', aedes.id)
// })

// // fired when a message is published
// aedes.on('publish', async function (packet, client) {
//   console.log('Client ' + (client ? client.id : 'BROKER_' + aedes.id) + ' has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
// })
