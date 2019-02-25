var express = require('express');
var router = express.Router();
var tcpServer = require('../bin/tcp-server.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '软硬结合demo1',tcpServer:tcpServer });
});

// POST / 控制设备开关灯
router.post('/',function(req, res, next) {
  let addr = req.body.addr
  let id = req.body.id
  let action = req.body.action
  if(action === 'open' || action === 'close'){
    tcpServer.sentCommand(id,addr,action)
  }
  res.json(req.body);
})

// 应部分读者要求，下面演示如何使用html而非pug模板
// GET /no-pug-index 不使用pug模板，直接发送html文件
router.get('/no-pug-index',function(req, res, next) {
  //root 传入文件所在的目录路径
  res.sendFile('no-pug-index.html',{root:"views"});
});

// 因为不使用模板，数据不能渲染到页面中显示，只能通过请求获取数据，再显示到页面中。
// 获取已经接入的设备列表
router.get('/equipmentArray',function(req, res, next) {
  let result = []
  tcpServer.equipmentArray.forEach((equipment)=>{
    result.push({
      addr:equipment.addr,
      id:equipment.id,
      lastValue:equipment.lastValue
    })
  })
  res.json(result)
  
});


module.exports = router;
