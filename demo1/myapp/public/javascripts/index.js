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

