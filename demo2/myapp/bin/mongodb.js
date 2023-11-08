// 模拟数据库保存数据
const dataObj = {

}

let mongodb ={
  insert:null,
  find:null
}


// 插入数据
// data是一个对象
mongodb.insert = function(data,callback) {
  //添加插入时间
  data.createdAt= new Date()
  if(!dataObj[data.id]){
    dataObj[data.id] = []
  }

  dataObj[data.id].push(data)
  // 超过10个的数据删除
  if(dataObj[data.id].length>10){
    dataObj[data.id].shift()
  }
}

// 查找数据
mongodb.find=function (data,callback) {
  callback(null,dataObj[data.id] || []);
}


module.exports=mongodb;