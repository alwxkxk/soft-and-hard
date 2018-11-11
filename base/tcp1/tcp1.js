/**
 * 文件：base/tcp1/tcp1.js
 * 作者：alwxkxk
 * 修改时间：2018/10/07
 * 描述：
 * 只是单纯地开启TCP服务器 9001端口：
 * 建立连接时返回：`${client addr} connected.\n`
 * 接收数据返回：`${client addr} receive:${data}`
 * 整个教程在不断迭代更新中：https://github.com/alwxkxk/soft-and-hard
 */

const net = require('net')
const PORT = "9001"

const server = net.createServer((socket)=>{
  //connect
  let addr = socket.address().address + ':' + socket.address().port
  let welcome =  addr + ' connected.\n'
  socket.write(welcome, 'ascii')

  // recieve data
  socket.on("data",data=>{
    let str = addr+" receive: " + data.toString('ascii') + '\n'
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
