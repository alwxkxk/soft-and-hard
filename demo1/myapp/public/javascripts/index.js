// 获取选中设备的信息
function getEquipmentInfo() {
  var str = $("select").val()
  if(!str){
    return console.log("无设备")
  }
  var addr = str.split(' - ')[0]
  var id = str.split(' - ')[1]
  console.log(addr,id)
  return {
    addr:addr,
    id:id
  }
  
}

// 点击按钮事件
$("#open").click(function(){
  var equipment = getEquipmentInfo()
  $.post("/", { action:"open",addr: equipment.addr, id: equipment.id } );
});
 
$("#close").click(function(){
  var equipment = getEquipmentInfo()
  $.post("/", { action:"close",addr: equipment.addr, id: equipment.id } );
});

function getData() {
  // 获取数据
  $.get("/equipmentArray",(res)=>{
    $("option.equipment-select-item").remove();
    $("tbody.equipment-table-item").remove();
    res.forEach(equipment => {
      //将设备数据转换成html元素添加到页面中

      //添加到选项中
      $('select').append('<option class="equipment-select-item">'+equipment.addr+' - '+equipment.id+'</option>')
  
  
      //添加到列表中
      $('table').append('<tbody class="equipment-table-item"><tr><td>0</td><td>'+equipment.addr+
      '</td><td>'+equipment.id+' </td><td style="overflow: hidden;">'+equipment.lastValue+'</td></tr></tbody>')
    });
    console.log(res)
  });
}

getData()

// 每一秒轮询一次
setInterval(() => {
  getData()
}, 1000);
