var express = require('express');
var router = express.Router();
let mongodb = require('../bin/mongodb');
let tcpServer = require('../bin/tcp-server.js');
const moment = require('moment')

// 默认显示 id为123456的设备
router.get('/', function(req, res, next) {
  res.render('index', { title: '智慧宿舍-123456' });
});

// 显示某设备数据
// GET /equipmentId/123456
router.get('/equipmentId/:id', function(req, res, next) {
  res.render('index', { title: '智慧宿舍-'+req.params.id });
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
