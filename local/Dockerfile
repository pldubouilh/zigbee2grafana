from koenkk/zigbee2mqtt

run apk update
run apk add entr openssh

copy ssh /root/.ssh
copy run.sh /app

workdir /app
entrypoint [ "sh", "/app/run.sh" ]