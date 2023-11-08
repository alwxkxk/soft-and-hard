// https://github.com/mongodb/node-mongodb-native
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'demo2';

let mongodb ={
  dbClient:null,
  db:null,
  insert:null,
  find:null
}


// 插入数据
// data是一个对象
mongodb.insert = function(data,callback) {
  if(mongodb.dbClient && mongodb.dbClient.isConnected()){
    // Get the documents collection
    const collection = mongodb.db.collection('equipment-data');
      // Insert some documents

    //添加插入时间
    data.createdAt= new Date()
    collection.insertOne(data, function(err, result) {
      if(err){
        callback(err)
      }
      callback(null,result);
    });

  }
  else{
    callback('mongodb is not connected!')
  }
}

// 查找数据
const findOptions={
  limit:10,//返回最多10条数据
  sort:{createdAt:-1}//返回最晚生成的数据
}
mongodb.find=function (data,callback) {
  if(mongodb.dbClient && mongodb.dbClient.isConnected()){
    // Get the documents collection
    const collection = mongodb.db.collection('equipment-data');

    collection.find(data,findOptions).toArray(function(err, docs) {
      if(err){
        callback(err)
      }
      callback(null,docs);
    });
  }
  else{
    callback('mongodb is not connected!')
  }
  
}

// 连接mongodb
MongoClient.connect(url,{useNewUrlParser:true}, function(err, client) {
  if(err){
    return console.log('mongodb err:',err)
  }
  console.log("mongodb client connected successfully to server.");

  // 连接mongodb中的数据库
  mongodb.dbClient = client
  mongodb.db = client.db(dbName);

  let collection = mongodb.db.collection('equipment-data');
  // 检查有无创建TTL（time to live） 索引，用于删除过期的数据。
  collection.indexExists("createdAt_1",(err,result)=>{
    if(err){
      return console.log(err)
    }
    else if(!result){
      console.log("create index: 'createdAt':expireAfterSeconds")
      //只保留一个小时内的数据
      collection.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )
    }
  })
});


module.exports=mongodb;