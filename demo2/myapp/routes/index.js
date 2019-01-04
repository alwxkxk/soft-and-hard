var express = require('express');
var router = express.Router();
let mongodb = require('../bin/mongodb')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '软硬结合——demo2' });
});

// 获取某设备的历史数据
// GET /id/123456 取得设备id为12356的数据。
router.get('/id/:id', function(req, res, next) {
  mongodb.find({id:req.params.id},(err,docs)=>{
    if(err){
      res.send(err)
    }
    else{
      res.send(docs)
    }
    
  })
});

module.exports = router;
