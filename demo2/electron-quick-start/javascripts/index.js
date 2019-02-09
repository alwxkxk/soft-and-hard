const { ipcRenderer } = nodeRequire('electron')

// 基于准备好的dom，初始化echarts实例
let myChart = echarts.init(document.getElementById('main'));

// 指定图表的配置项和数据
let option = {
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
function updateMyChart(time,value) {
  //如果value不是数值则跳过
  if(!$.isNumeric(value)){
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

//接收实时数据
ipcRenderer.on('equipment-data', (event, data) => {
  console.log('equipment-data:',data)
  data.forEach(d => {
    updateMyChart(d.time,d.value)
  });
})
// $('#equipmentId').val('123456')
console.log('value:',$('#equipmentId').val())
//订阅 设备 的实时数据
function subscribeEquipment(equipmentId) {
  ipcRenderer.send('subscribe-equipment', equipmentId)
}
subscribeEquipment($('#equipmentId').val())

// 页面修改设备ID时 重新订阅设备实时数据
$("#equipmentId").change(function(){
  let equipmentId = $('#equipmentId').val()
  subscribeEquipment(equipmentId)
});

function equipmentAction(equipmentId,action) {
  ipcRenderer.send('equipment-action', {id:equipmentId,action:action})
}
//给开关灯按钮添加事件
$('#open-led').click(()=>{
  let equipmentId = $('#equipmentId').val()
  equipmentAction(equipmentId,'open')
})

$('#close-led').click(()=>{
  let equipmentId = $('#equipmentId').val()
  equipmentAction(equipmentId,'close')
})


