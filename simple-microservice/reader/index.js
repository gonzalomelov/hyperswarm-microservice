import Hyperswarm from 'hyperswarm'
import Hypercore from 'hypercore'
import Hyperbee from 'hyperbee'
import path from 'bare-path'
import b4a from 'b4a'
import process from 'bare-process'

const swarm = new Hyperswarm({ bootstrap: ['0.0.0.0:30001'] })
Pear.teardown(() => swarm.destroy())

const core = new Hypercore(path.join(Pear.config.storage, 'dictionary'), Pear.config.args[0])
const db = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'json' })
await core.ready()
console.log('Key', b4a.toString(core.key, 'hex'))

process.stdin.on('data', async data => {
  const key = b4a.toString(data, 'utf-8').trim()
  const entry = await db.get(key)
  console.log(entry?.value)
})

const foundPeers = core.findingPeers()
swarm.join(core.discoveryKey, { server: false, client: true })
swarm.on('connection', conn => {
  console.log('Connected to', b4a.toString(conn.remotePublicKey, 'hex'))

  db.replicate(conn)
})

swarm.flush().then(() => foundPeers())

await db.update()

let start = 0
let position = start
console.log(`Skipping ${start} earlier blocks...`)
for await (const entry of db.createReadStream()) {
  console.log(`Entry ${position++}: ${entry.key}`)
}