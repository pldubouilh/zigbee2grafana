from node:current-slim

run mkdir /code

copy index.js /code/index.js
copy package.json /code
copy package-lock.json /code

run cd /code && npm i

entrypoint [ "node", "/code/index.js" ]