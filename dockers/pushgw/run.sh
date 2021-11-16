chmod 600 /root/.ssh/key
chmod 777 /state.json

IP= #HERE IP !

while true; do
    # push current state as soon as it's written on disk
    ls /state.json | entr -npz "echo"
    scp -qi /root/.ssh/key /state.json ${IP}:/root/state.json
    sleep 1
done
