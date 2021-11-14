chmod 600 /root/.ssh/key
chmod 777 /app/data/state.json

IP= # HERE IP !

touch /app/data/state.json
while true; do
    # push current state as soon as it's written on disk
    ls /app/data/state.json | entr -pz "echo"
    scp -qi /root/.ssh/key /app/data/state.json ${IP}:/root/state.json
done&

# amend state saving interval to every 15 seconds
sed -i 's/const.saveInterval.*/const\ saveInterval=15000/g' lib/state.*
node index.js