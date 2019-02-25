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

$.get("/equipmentArray",(res)=>{
  res.forEach(equipment => {
    //将设备数据转换成html元素添加到页面中
    //添加到选项中
    $('select').append('<option>'+equipment.addr+' - '+equipment.id+'</option>')


    //添加到列表中
    $('table').append('<tbody><tr><td>0</td><td>'+equipment.addr+
    '</td><td>'+equipment.id+' </td><td style="overflow: hidden;">'+equipment.lastValue||'无'+'</td></tr></tbody>')
  });
  console.log(res)
});