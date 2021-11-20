zigbee2grafana
=========

![](https://user-images.githubusercontent.com/760637/142053394-65e2f879-c3a1-4012-97e7-445ff372732b.png)

a convoluted setup to extract local zigbee sensor data, take action depending on sensor state, or export data onwards for display with shiny grafana dashboards.

the motivation was to use grafana/prometheus for visual dashboards, and using simple JS code for taking action based on sensor values [e.g. setting heating at certain time](https://github.com/pldubouilh/zigbee2grafana/blob/main/dockers/logic/index.js).

most of the code here consists of small scripts, and lots of glue. the real work is handled by [zigbee2mqtt](https://github.com/Koenkk/zigbee2mqtt)!

## modes of operation

3 modes of operations can be used - but in both cases, it needs a sensor and [one of these zigbee USB devices](https://www.amazon.de/-/en/dp/B08F9F276S/) plugged in locally.

* local-local - zigbee gateway runs locally, and the UI runs locally (separate docker-compose)

* local-remote - zigbee gateway runs locally, and the UI runs somewhere else (in a server you own)

* local-only - zigbee gateway runs locally, and no UI is provided (enough for local logic)

### local-local

```sh
# prepare data folders
% git clone https://github.com/pldubouilh/zigbee2grafana.git
% cd zigbee2grafana
% mkdir -p data/prometheus/data data/grafana/data
% chmod 777 data/prometheus/data data/grafana/data

# start zigbee gateway
% sudo docker-compose -f zigbee-local.yml up

# start ui (separate shell)
% sudo docker-compose -f ui-local.yml up

# open browser at http://127.0.0.1:3000
```

### local-remote
locally
```sh
% git clone https://github.com/pldubouilh/zigbee2grafana.git
% cd zigbee2grafana

# copy ssh keys over so that push gateway can send over state of sensors
% cp ~/.ssh/serverkey dockers/logic/ssh/key
% cp ~/.ssh/known_hosts dockers/logic/ssh/

# amend script to set destination IP
% vim dockers/logic/index.js

# start zigbee gateway
% sudo docker-compose -f zigbee-remote.yml up

# open browser at http://127.0.0.1:3000
```

and on the remote end
```sh
# prepare data folders
% git clone https://github.com/pldubouilh/zigbee2grafana.git
% cd zigbee2grafana
% chmod 777 data/prometheus/data data/grafana/data

# amend Caddyfile with domain name of server
% vim data/caddy/Caddyfile

# run
% apt install docker-compose
% sudo docker-compose -f ui-remote.yml up

# open browser at https://mydomain.com - login details are in data/caddy/Caddyfile
```

### local-only

```sh
% git clone https://github.com/pldubouilh/zigbee2grafana.git
% cd zigbee2grafana

# start zigbee gateway
% sudo docker-compose -f zigbee-local.yml up
```
