'use strict'

const RPC = require('@hyperswarm/rpc')
const DHT = require('hyperdht')

const createServer = async () => {
  const node = new DHT({
    bootstrap: ['0.0.0.0:30001']
  })
  
  const rpc = new RPC({
    dht: node
  })
  
  const server = rpc.createServer()
  await server.listen()
  console.log(server.publicKey.toString('hex'))
  
  server.respond('hello', (req) => {
    const response = req.toString('utf-8')
    console.log(response)
    return Buffer.from(`hello ${response}`)
  })
  
  const shutdown = async () => {
    console.log('Shutting down...')
    await server.close()
    await rpc.destroy()
    await node.destroy()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  
}

createServer().catch(error => {
  console.error('Server error: ', error)
  process.exit(-1)
})