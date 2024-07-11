import DHT from 'hyperdht'
import b4a from 'b4a'
import process from 'bare-process'

console.log('Connecting to:', '773646d2faad3847f3a579f2ace013811b39bc474b4addac9a473628fbc58068')
const publicKey = b4a.from('773646d2faad3847f3a579f2ace013811b39bc474b4addac9a473628fbc58068', 'hex')

const dht = new DHT()
const conn = dht.connect(publicKey)
conn.once('open', () => console.log('got connection!'))

process.stdin.pipe(conn).pipe(process.stdout)