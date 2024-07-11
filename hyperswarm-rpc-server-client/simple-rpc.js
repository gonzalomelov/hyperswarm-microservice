const RPC = require('@hyperswarm/rpc')
const DHT = require('hyperdht')

const main = async () => {
  const node = new DHT({
    bootstrap: ['0.0.0.0:30001']
  })

  const rpc = new RPC({
    dht: node
  })

  const server = rpc.createServer()
  await server.listen()
  console.log('Server listening...')

  server.respond('sum', (req) => {
    console.log('Request received: ', req.toString('utf-8'))
    return Buffer.from('melo')
  })

  const client = rpc.connect(server.publicKey)
  console.log(client.dht.bootstrapNodes)
  const response = await client.request('sum', Buffer.from('gonzalo'))
  console.log('Response received: ', response.toString('utf-8'))
  
  await client.end()
  await server.close()
  await rpc.destroy()
  await node.destroy();
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1); // Exit with a failure code
});