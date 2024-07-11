import DHT from 'hyperdht'
import b4a from 'b4a'
import process from 'bare-process'

const dht = new DHT()

// This keypair is the peer identifier in the DHT
const keyPair = DHT.keyPair()

const server = dht.createServer(conn => {
  console.log('got connection!')
  process.stdin.pipe(conn).pipe(process.stdout)
})

server.listen(keyPair).then(() => {
  console.log('listening on:', b4a.toString(keyPair.publicKey, 'hex'))
})

// Unnannounce the public key before exiting the process
// (This is not a requirement, but it helps avoid DHT pollution)
Pear.teardown(() => server.close())