// 获取当前host，用于提供url以建立websocket
const host = window.location.host
// 从当前网址里获取设备id ,比如 https://127.0.0.1/equipmentId/789 分析得到设备ID为789，若没有则为123456
var equipmentId = window.location.pathname.split("/")[2] || "123456"

// 创建websocket连接
const socket = new WebSocket('ws://'+host);
// 如果是部署到服务器并配置了SSL证书，应该使用wss协议 
// const socket = new WebSocket('wss://'+host);

// 如果建立连接
socket.onopen=function () {
  console.log("websocket connect!")
  var data = JSON.stringify({equipmentId:equipmentId})
  socket.send(data)
}

// 监听接收数据
socket.onmessage=function (msg) {
  console.log("-->",msg.data)
  try {
    // 将JSON字符串反转为JSON对象
    var data = JSON.parse(msg.data)
    data.forEach(function (d) {
      //将接收到的数据 更新到echart图表里
      updateMyChart(d.time,d.value)
    });
  } catch (error) {
    console.log('error:',error)
  }
}

socket.onclose=function () {
  console.log("websocket close.")
}

socket.onerror=function () {
  console.log("websocket error:",event)
}

function postData(equipmentId,actionString){
  // 发送控制指令
  if(!equipmentId){
    return console.log('没设备，不可发送指令')
  }
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var params = 'action='+actionString
  httpRequest.open('POST', '/led/'+equipmentId);
  httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  httpRequest.send(params);
}


//给开关灯按钮添加事件，发起请求 POST /led/:id
document.getElementById('open-led').onclick = ()=>{
  postData(equipmentId,'open')
}

document.getElementById('close-led').onclick = ()=>{
  postData(equipmentId,'close')
}




// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

// 指定图表的配置项和数据
var option = {
  color:'#fff',
  textStyle:{
    color:'#fff',
    fontWeight:900,
    fontSize:24
  },
  title: {
    text: '实时温度',
    textStyle:{
      color:'#fff'
    }
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [],
    type: 'line',
    smooth: true
  }]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

// 给echart插入新数据
function updateMyChart(time,val) {
  var value = Number(val)
  //如果value不是数值则跳过
  if(typeof value !== 'number'){
    console.log('不是数值，跳过：',value,value instanceof Number)
    return ;
  }

  option.xAxis.data.push(time)
  option.series[0].data.push(value)
  // 如果数据超过10个，把第一个数据删除。
  if(option.xAxis.data.length > 10){
    option.xAxis.data.shift()
    option.series[0].data.shift()
  }
  myChart.setOption(option);
}

function getHistory() {
  //获取历史数据
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = ()=>{
    if( httpRequest.readyState === 4){
      // 4	DONE	下载操作已完成。
      const data = JSON.parse(httpRequest.responseText)
      console.log("history:",data)
      data.forEach((v)=>{
        updateMyChart(v.time,v.value)
      })
    }
  };

  httpRequest.open('GET', '/history/'+equipmentId);
  httpRequest.send();
}
getHistory()


function getEquipmentList() {
  // 获取设备列表打印出来方便调试
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = ()=>{
    if( httpRequest.readyState === 4){
      // 4	DONE	下载操作已完成。
      console.log('设备列表：',JSON.parse(httpRequest.responseText))
    }
  };

  httpRequest.open('GET', '/equipment-list');
  httpRequest.send();
}

getEquipmentList()


