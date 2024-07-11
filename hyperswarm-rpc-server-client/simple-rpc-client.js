'use strict'

const RPC = require('@hyperswarm/rpc')
const DHT = require('hyperdht')

const runClient = async () => {
  const node = new DHT({
    bootstrap: ['0.0.0.0:30001']
  })
  
  const rpc = new RPC({
    dht: node
  })
  
  const client = rpc.connect(Buffer.from('0f68ba7054ee791f2d62a17f903e1cf711e2429574bb89d708fbc48d2503d893', 'hex'))
  const response = await client.request('hello', Buffer.from('Gonzalo'))
  console.log(response.toString('utf-8'))
  
  await client.end()
  await rpc.destroy()
  await node.destroy()
}

runClient().catch(error => {
  console.error('Client error: ', error)
  process.exit(-1)
})