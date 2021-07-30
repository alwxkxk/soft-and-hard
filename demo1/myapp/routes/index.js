var express = require('express');
var router = express.Router();
var tcpServer = require('../bin/tcp-server.js');
var path = require ('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // 默认是使用pug模板的，为了减少不必要的学习与降低入门门槛，改使用html。
  res.sendFile('index.html',{root:path.join(__dirname , '../views')});
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
