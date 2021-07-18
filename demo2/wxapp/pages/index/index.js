import * as echarts from '../../ec-canvas/echarts';
let option = {
  color: '#fff',
  textStyle: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 24
  },
  title: {
    text: '实时温度',
    textStyle: {
      color: '#fff'
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
    type: 'line',
    data: []
  }]
};
let myChart = null
const app = getApp();

// 给echart插入新数据
function updateMyChart(time, value) {
  option.xAxis.data.push(time)
  option.series[0].data.push(value)
  // 如果数据超过10个，把第一个数据删除。
  if (option.xAxis.data.length > 10) {
    option.xAxis.data.shift()
    option.series[0].data.shift()
  }
  if (myChart){
    myChart.setOption(option);
  }
}

function initWebsocket(){
  wx.connectSocket({
    url: app.globalData.websocketURL
  })

  wx.onSocketOpen(function (res) {
    //建立连接时，先发送equipmentId，以接收设备实时数据
    let data = JSON.stringify({
      equipmentId: app.globalData.equipmentId
    })
    wx.sendSocketMessage({data:data})
  })

  wx.onSocketMessage(function (msg) {
    console.log('-->', msg)
    try {
      // 将JSON字符串反转为JSON对象
      let data = JSON.parse(msg.data)
      data.forEach(d => {
        //将接收到的数据 更新到echart图表里
        updateMyChart(d.time, d.value)
      });
    } catch (error) {
      console.log('error:', error)
    }
  })
}




function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  myChart = chart;
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },
  openLED:function(){
    wx.request({
      url: app.globalData.requestHost + '/led/' + app.globalData.equipmentId,
      data: {
        action: 'open'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:'POST',
      success(res) {
        console.log('open led',res.data)
      }
    })
  },
  closeLED: function () {
    wx.request({
      url: app.globalData.requestHost + '/led/' + app.globalData.equipmentId,
      data: {
        action: 'close'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log('close led', res.data)
      }
    })
  },
  onShow() {
    initWebsocket()
  },
  onHide(){
    wx.closeSocket()
  }
});