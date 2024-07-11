import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'
import process from 'bare-process'

const swarm = new Hyperswarm({
  bootstrap: ['0.0.0.0:30001']
})
Pear.teardown(() => swarm.destroy())

const conns = []

swarm.on('connection', (conn) => {
  const name = b4a.toString(conn.remotePublicKey, 'hex')
  console.log('new connection from ', name);

  conns.push(conn)
  conn.once('close', () => conns.splice(conns.indexOf(conn), 1))
  conn.on('data', data => console.log(`${name}: ${data}`))
  conn.on('error', e => console.log(`Connection error ${e}`))
})

process.stdin.on('data', (data) => {
  for (const conn of conns) {
    conn.write(data)
  }
})

const topic = b4a.from('53d4ff5f33d5387a300c43a8cd6f909591b9924350c808f40310ab1de6b75059', 'hex');

const discovery = swarm.join(topic, { client: true, server: true })
discovery.flushed().then(() => {
  console.log('joined topic: ', topic.toString('hex'))
})

// console.log(b4a.toString(swarm.keyPair.publicKey, 'hex'))

// swarm.topics()

// swarm.topics('hello', (conn) => {
//   console.log()
// })