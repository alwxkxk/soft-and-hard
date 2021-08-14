// 导入net模块:
const net = require('net')
const PORT = "9002"
const equipmentArray = []
const TIMEOUT = 30*1000; // 30秒没接收到数据就断开连接
//创建服务器对象
const server = net.createServer((socket)=>{
  //connect
  let addr = socket.remoteAddress + ':' + socket.remotePort
  console.log(addr," connected.")

  // receive data
  socket.on("data",data=>{
		let str = addr+" --> " + data.toString('ascii')
		socket.lastValue = data.toString('ascii')
		console.log(str)

    // demo1中，我们定义了，接收的第一条数据为设备id
    if(!socket.id){
			socket.id = data.toString('ascii')
			socket.addr = addr
			addEquipment(socket)
    }
  })

  // close
  socket.on('close',()=>{
		console.log(addr,socket.id,"close")
		console.log("equipmentArray.length:",equipmentArray.length)
		deleteEquipment(socket.id,socket.addr)
	})
	
	socket.on('error',()=>{
		console.log(addr,socket.id,"error")
		deleteEquipment(socket.id,socket.addr)
	})

	socket.setTimeout(TIMEOUT);
	// 超过一定时间 没接收到数据，就主动断开连接。
	socket.on('timeout', () => {
		console.log(socket.id,socket.addr,'socket timeout');
		deleteEquipment(socket.id,socket.addr)
		socket.end();
	});

})

server.on("error",(err)=>{
	console.log(err)
	deleteEquipment(socket.id,socket.addr)
})

//开启监听
server.listen({port: PORT,host: '0.0.0.0'}, () => {
  console.log('demo1 TCP服务器 启动：', server.address())
})

// 给列表添加设备
function addEquipment(socket) {
	// 先从列表删除旧的同名连接
	deleteEquipment(socket.id,socket.addr)
	equipmentArray.push(socket)
	
}

// 从列表中删除设备
function deleteEquipment(id,addr){
	if(!id || !addr){
		return ;
	}

	let index = null
	let i
	// 从数组中找到它的位置
	for(i=0;i<equipmentArray.length;i++){
		if(equipmentArray[i].id === id && equipmentArray[i].addr === addr){
			index = i;
		}
	}
	// 从数组中删除该设备
	if(index != null){
		equipmentArray.splice(index,1)
	}
	
}

// 在列表中找到某个id、addr的设备，结果为数组，可能包含多个socket。
function findEquipment(id,addr) {
	let result = []
	let i

	for(i=0;i<equipmentArray.length;i++){
		if(equipmentArray[i].id === id && equipmentArray[i].addr === addr){
			result.push(equipmentArray[i])
		}
	}
	return result
}

// 给设备发送控制命令
function sentCommand(id,addr,command) {
	let equipments = findEquipment(id,addr)
	if(equipments.length === 0){
		return;
	}
	if(command === 'open'){
		equipments.forEach((socket)=>{
			socket.write("1", 'ascii')
		})
	}
	else if(command === 'close'){
		equipments.forEach((socket)=>{
			socket.write("0", 'ascii')
		})
	}

}

module.exports={
	equipmentArray:equipmentArray,
	addEquipment:addEquipment,
	deleteEquipment:deleteEquipment,
	findEquipment:findEquipment,
	sentCommand:sentCommand
}