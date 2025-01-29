// https://github.com/mongodb/node-mongodb-native
// 操作文档：https://www.mongodb.com/zh-cn/docs/drivers/node/current
const MongoClient = require('mongodb').MongoClient;


const url = 'mongodb://localhost:27017';

let mongodb ={
  dbClient:null,
  db:null,
  insert:null,
  find:null
}

// Database Name
const dbName = 'demo2';

const dbClient = new MongoClient(url);
mongodb.dbClient = dbClient

console.log('尝试连接数据库...')
dbClient.connect().then(()=>{
  mongodb.db = dbClient.db(dbName);
  const collection = mongodb.db.collection('equipment-data');
  //创建TTL（time to live） 索引，只保留一个小时内的数据，超出就自动删除。
  collection.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )

  console.log('成功连接mongodb数据库。');
}).catch(()=>{
  console.error('连接数据库失败。')
})

// then,catch语法属于ES6的promise语法，需要读者自行学习。

// 插入数据
// data是一个对象
mongodb.insert = function(data,callback) {
  if(!mongodb.db){
    callback('数据库还没连接成功。')
    return 
  }
    const collection = mongodb.db.collection('equipment-data')
    //添加插入时间
    data.createdAt= new Date()
    collection.insertOne(data).catch(()=>{
      console.log('mongodb保存数据失败。')
    })
}

// 查找数据
const findOptions={
  limit:10,//返回最多10条数据
  sort:{createdAt:-1}//返回最晚生成的数据
}
mongodb.find=async function (data,callback) {
  if(!mongodb.db){
    callback('数据库还没连接成功。')
    return
  }

  const collection = mongodb.db.collection('equipment-data');
  const result = []
  const cursor = collection.find(data,findOptions)

  for await (const item of cursor) {
    result.push(item);
  }
  callback(null,result)

}

module.exports=mongodb;