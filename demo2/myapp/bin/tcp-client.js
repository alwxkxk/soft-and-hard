const net = require('net');

let client = new net.Socket();

function init() {
  client.connect(9003, '127.0.0.1', function() {
    console.log('tcp-client Connected.');
    // 先发送设备id
    client.write('123456')
    //定时发送随机数
    let interval = setInterval(()=>{
      if(!client.destroyed){
        client.write( String(20+Math.random().toFixed(2)*10))
      }
      else{
        clearInterval(interval)
      }
      
    },1000)
  });

  client.on('data', function(data) {
    console.log('tcp-client received: ' + data);
  });
  
  client.on('close', function() {
    console.log('Connection closed.');
  });


}

module.exports={init:init}

