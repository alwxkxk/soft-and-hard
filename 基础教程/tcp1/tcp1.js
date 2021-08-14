const net = require('net')
const PORT = "9001"

const server = net.createServer((socket)=>{
  //connect
  let addr = socket.remoteAddress + ':' + socket.address().port
  let welcome =  addr + ' connected.\n'
  socket.write(welcome, 'ascii')

  // recieve data
  socket.on("data",data=>{
    let str = addr+" --> " + data.toString('ascii') + '\n'
    console.log(str)
    socket.write(str, 'ascii')
  })

  // close
  socket.on('close',()=>{
    console.log(addr,"close")
  })

  socket.on('error',(err)=>{
		console.log("error",err)
  })
  
})

server.on("error",(err)=>{
  console.log(err)
})

server.listen({port: PORT,host: '0.0.0.0'}, () => {
  console.log('tcp1 server running on', server.address())
})
