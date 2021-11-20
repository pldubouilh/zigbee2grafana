from node:lts-alpine

run mkdir /code
run apk update
run apk add openssh

copy . /app

run mv /app/ssh ~/.ssh
run chmod 600 ~/.ssh/key

run cd /app && npm i

entrypoint [ "node", "/app/index.js" ]