import Hyperswarm from 'hyperswarm'
import Hypercore from 'hypercore'
import path from 'bare-path'

const swarm = new Hyperswarm()
Pear.teardown(() => swarm.destroy())

const core = new Hypercore(path.join(Pear.config.storage, 'reader-storage2'), Pear.config.args[0])
await core.ready()

const foundPeers = core.findingPeers()
swarm.join(core.discoveryKey)
swarm.on('connection', conn => core.replicate(conn))

swarm.flush().then(() => foundPeers())

await core.update()

let position = core.length
console.log(`Skipping ${core.length} earlier blocks...`)
for await (const block of core.createReadStream({ start: core.length, live: true })) {
  console.log(`Block ${position++}: ${block}`)
}
