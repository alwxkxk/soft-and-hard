// 创建websocket连接
const socket = new WebSocket('wss://echo.websocket.org/');

// 如果建立连接
socket.onopen=()=>{
  console.log("websocket connect!")
  let i=0;
  //定时发送数据
  let interval = setInterval(() => {
    //WebSocket.readyState:
    // 0 (CONNECTING):The connection is not yet open.
    // 1 (OPEN):The connection is open and ready to communicate.
    // 2 (CLOSING):The connection is in the process of closing.
    // 3 (CLOSED):The connection is closed or couldn't be opened.
    // 如果不处于连接状态，就停止定时发送数据
    if(socket.readyState !== 1){
      clearInterval(interval)
      return;
    }else{
      i++;
      socket.send('tick - '+i);
    }
  }, 1000);
}

// 监听接收数据
socket.onmessage=(message)=>{
  console.log("-->",message.data)
}

socket.onclose=()=>{
  console.log("websocket close.")
}

socket.onerror=(event)=>{
  console.log("websocket error:",event)
}