import Hyperswarm from 'hyperswarm'
import Hypercore from 'hypercore'
import path from 'bare-path'
import process from 'bare-process'
import b4a from 'b4a'

const swarm = new Hyperswarm()
Pear.teardown(() => swarm.destroy())

console.log(Pear.config.storage)

const core = new Hypercore(path.join(Pear.config.storage, 'writer-storage'))

await core.ready()
console.log('hypercore key: ', b4a.toString(core.key, 'hex'))

process.stdin.on('data', (data) => core.append(data))

swarm.join(core.discoveryKey)
swarm.on('connection', conn => core.replicate(conn))
