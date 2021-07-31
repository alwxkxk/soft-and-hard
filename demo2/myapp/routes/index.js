var express = require('express');
var router = express.Router();
var mongodb = require('../bin/mongodb');
var tcpServer = require('../bin/tcp-server.js');
var path = require ('path');
var moment = require('moment')


// 默认显示 id为123456的设备
router.get('/', function(req, res, next) {
  // 默认是使用pug模板的，为了减少不必要的学习与降低入门门槛，改使用html。
  res.sendFile('index.html',{root:path.join(__dirname , '../views')});
  // res.render('index', { title: '智慧宿舍-123456' });
});

/*获取连接设备列表 */
router.get('/equipment-list', function(req, res, next) {
  const list = []
  tcpServer.equipmentArray.forEach(equipment=>{
    const data = {
      id:equipment.id,
      addr:equipment.addr
    }
    list.push(data)
  })
  res.send({code:0,data:list})
});

// 显示某设备数据
// GET /equipmentId/123456
router.get('/equipmentId/:id', function(req, res, next) {
  // 默认是使用pug模板的，为了减少不必要的学习与降低入门门槛，改使用html。
  res.sendFile('index.html',{root:path.join(__dirname , '../views')});
  // res.render('index', { title: '智慧宿舍-'+req.params.id });
});

// 获取某设备的历史数据
// GET /history/123456 取得设备id为12356的数据。
router.get('/history/:id', function(req, res, next) {
  mongodb.find({id:req.params.id},(err,docs)=>{
    if(err){
      res.send([])
      console.log(err)
    }
    else{
      let result = []
      docs.forEach( (doc) => {
        result.push({
          time:moment(doc.createdAt).format('mm:ss'),
          value:doc.data
        })
      });
      result.reverse()
      
      res.send(result)
    }
    
  })
});

// 向某设备发送 开/关 LED命令
router.post('/led/:id',function (req,res,next) {
  console.log('post /led/:id - ',req.params.id,req.body);
  tcpServer.sentCommand(req.params.id,req.body.action)
  res.send({code:0,msg:'命令已发送'})
})


module.exports = router;
