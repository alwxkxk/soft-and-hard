const WebSocket = require('ws');
const moment = require('moment')

// 初始化websocket服务器
function init(server) {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws)=>{
    console.log("websocket connection.")
    ws.on('message', (message)=>{
      console.log('received: %s', message);
      ws.send('echo:'+message);
    });

    let interval = setInterval(()=>{
      if(ws.readyState === WebSocket.OPEN){
        
        let data = [
          {
            time:moment().format('mm:SS'),//moment生成时间 
            value:22+Math.random().toFixed(2)*10
          }
        ]
        //ws 模块只支持传送二进制或字符串，将数组转换成JSON字符串再发送出去
        let stringifyData  = JSON.stringify(data)
        ws.send(stringifyData);
      }
      else{
        clearInterval(interval)
      }
    },1000)

    ws.on('close',()=>{
      console.log('websocket close.')
    })

    ws.on('error',(err)=>{
      console.log('websocket error.',err)
    })

  });
}

module.exports = {
  init:init
}