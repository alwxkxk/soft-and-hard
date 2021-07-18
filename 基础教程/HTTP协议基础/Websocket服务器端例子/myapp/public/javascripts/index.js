// 获取当前host，用于提供url以建立websocket
const host = window.location.host
// 创建websocket连接
const socket = new WebSocket('ws://'+host);

// 如果建立连接
socket.onopen=()=>{
  console.log("websocket connect!")
}

// 监听接收数据
socket.onmessage=(msg)=>{
  console.log("-->",msg.data)
  try {
    // 将JSON字符串反转为JSON对象
    let data = JSON.parse(msg.data)
    data.forEach(d => {
      updateMyChart(d.time,d.value)
    });
  } catch (error) {
    console.log('error:',error)
  }
}

socket.onclose=()=>{
  console.log("websocket close.")
}

socket.onerror=(event)=>{
  console.log("websocket error:",event)
}


// 基于准备好的dom，初始化echarts实例
let myChart = echarts.init(document.getElementById('main'));

// 指定图表的配置项和数据
let option = {
  title: {
    text: '实时温度'
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

function updateMyChart(time,value) {
  option.xAxis.data.push(time)
  option.series[0].data.push(value)
  // 如果数据超过30个，把第一个数据删除。
  if(option.xAxis.data.length > 30){
    option.xAxis.data.shift()
    option.series[0].data.shift()
  }
  myChart.setOption(option);
}