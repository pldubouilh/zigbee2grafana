from alpine:edge

run apk update
run apk add entr openssh

copy run.sh /

entrypoint [ "sh", "/run.sh" ]