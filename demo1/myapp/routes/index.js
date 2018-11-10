var express = require('express');
var router = express.Router();
var tcpServer = require('../bin/tcp-server.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '软硬结合demo1',tcpServer:tcpServer });
});

router.post('/',function(req, res, next) {
  let addr = req.body.addr
  let id = req.body.id
  let action = req.body.action
  if(action === 'open' || action === 'close'){
    tcpServer.sentCommand(id,addr,action)
  }
  res.json(req.body);
})

module.exports = router;
