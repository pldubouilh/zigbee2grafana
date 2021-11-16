# amend state saving interval to every 15 seconds
sed -i 's/const.saveInterval.*/const\ saveInterval=15000/g' lib/state.*
node index.js