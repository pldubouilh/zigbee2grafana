zigbee2grafana
=========

a convoluted setup to extract local zigbee sensor data, and export them onwards to a server for storage (prometheus), and display with grafana.
access is gated and secured by [caddy](https://caddyserver.com/).

the code consists of a [bash script](https://github.com/pldubouilh/zigbee2grafana/blob/main/local/run.sh) to copy the local state of the sensors onto a remote server and [30 lines of JS](https://github.com/pldubouilh/zigbee2grafana/blob/main/server/mangler/mangle.js) to convert the state of the senors into something prometheus can process. the rest is glue and configfiles.

#### remote setup
get a server somewhere, setup DNS with a domain name

```sh
# copy code and send server bit over
% git clone https://github.com/pldubouilh/zigbee2grafana.git
% scp -r zigbee2grafana/server myserver@:/root

# reach server
% ssh myserver
% cd server

# setup data folders rights
% chmod 777 caddy/data prometheus/data grafana/data

# amend caddy conf with domain name
% vim caddy/Caddyfile

# run
% apt install docker-compose
% docker-compose up
```


#### local setup
get one of [these zigbee USB devices](https://www.amazon.de/-/en/dp/B08F9F276S/)

```sh
# copy keys
% cd zigbee2grafana/local
% cp ~/.ssh/myserver.key ssh/key
% cp ~/.ssh/known_hosts ssh

# amend config file with IP of server
% vim run.sh

# run (sudo needed to pass USB device onto docker)
% sudo make run
```

#### observe

pair your device (usually longpress on the switch), it should be logging values on the local end.

then log in on your server (details in [Caddyfile](https://github.com/pldubouilh/zigbee2grafana/blob/main/server/caddy/Caddyfile)), and explore the values being pushed. Additionally, set a friendly nickname to the sensor by amending `server/mangler/mangle.js` on the server.

