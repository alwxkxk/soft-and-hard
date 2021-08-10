var fs = require('fs');
var http = require('http');
var net = require('net');
var HTTP_PORT = "8000";
var TCP_PORT = "9000"
var TIMEOUT = 30*1000;//tcp客户端超过30秒没发数据判为超时并断开连接
var tcpClient=null;//tcp客户端

// 创建http server，并传入回调函数:
var httpServer = http.createServer(function (request, response) {
  // 回调函数接收request和response对象,
  // 获得HTTP请求的method和url:
  console.log(request.method + ': ' + request.url);
  switch (request.url) {
    case "/":
      //访问首页
      // 读取html文件并发送
      response.end(fs.readFileSync('./index.html'));
      break;
    case "/open":
      // 开灯命令
      openLed()
      response.end('succeed');
      break;
    case "/close":
      // 开灯命令
      closeLed()
      response.end('succeed');
      break;
    case "/data":
      // 获取数据
      var data = getData() || "无数据";

      var addr = "无连接";
      if(tcpClient && tcpClient.addr){
        addr = tcpClient.addr
      }
      
      // 将结果转换成字符串再发出去
      var result = JSON.stringify({addr:addr,data:data});
      response.end(result);
      break;
    default:
      response.writeHead(400);
      response.end();
      break;
  }
});

httpServer.listen(HTTP_PORT);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

//创建TCP服务器
var tcpServer = net.createServer((socket)=>{
  //connect
  var addr = socket.remoteAddress + ':' + socket.remotePort
  console.log(addr," connect.",socket)
  socket.addr = addr
  tcpClient = socket

  // recieve data
  socket.on("data",data=>{
    var str = addr+" --> " + data.toString('ascii') + '\n'
    console.log(str)
    socket.lastValue = data.toString('ascii')
  })

  // close
  socket.on('close',()=>{
    console.log(addr,"close")
    tcpClient = null;
  })

  socket.on('error',(err)=>{
    console.log("error",err)
    tcpClient = null;
  })

  socket.setTimeout(TIMEOUT);
	// 超过一定时间 没接收到数据，就主动断开连接。
	socket.on('timeout', () => {
		console.log(socket.id,socket.addr,'socket timeout');
    socket.end();
    tcpClient = null;
	});
})

tcpServer.on("error",(err)=>{
  console.log(err)
  tcpClient = null;
})

tcpServer.listen({port: TCP_PORT,host: '0.0.0.0'}, () => {
  console.log('demo0.1 tcp server running on', tcpServer.address())
})

// 开灯
function openLed() {
  // 向TCP客户端发送1
  if(tcpClient){
    tcpClient.write('1', 'ascii')
  }
  else{
    console.log("openLed error:not tcpClient.")
  }
}

// 关灯
function closeLed() {
  // 向TCP客户端发送0
  if(tcpClient){
    tcpClient.write('0', 'ascii')
  }
  else{
    console.log("closeLed error:not tcpClient.")
  }
}

// 获取数据
function getData() {
  // 获取设备最新数据
  if(tcpClient){
    return tcpClient.lastValue
  }
  else{
    console.log("getData error:not tcpClient.")
  }

}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  console.error(error)

}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('http server Listening on ' + bind);
}