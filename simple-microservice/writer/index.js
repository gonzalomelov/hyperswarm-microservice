import Hyperswarm from 'hyperswarm'
import Hypercore from 'hypercore'
import Hyperbee from 'hyperbee'
import path from 'bare-path'
import b4a from 'b4a'
import fs from 'bare-fs'

const swarm = new Hyperswarm({ bootstrap: ['0.0.0.0:30001'] })
Pear.teardown(() => swarm.destroy())

const core = new Hypercore(path.join(Pear.config.storage, 'dictionary'))
const db = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'json' })

await core.ready()
console.log('Key', b4a.toString(core.key, 'hex'))

const buffer = fs.readFileSync('./dict-small.json')
const jsonString = b4a.toString(buffer, 'utf-8')
const json = JSON.parse(jsonString)
json.map(pair => {
  db.put(pair.key, pair.value)
})

const discovery = swarm.join(core.discoveryKey, { server: true, client: false })
swarm.on('connection', conn => {
  console.log('New connection from', b4a.toString(conn.remotePublicKey, 'hex'))

  db.replicate(conn)
})
await discovery.flushed()