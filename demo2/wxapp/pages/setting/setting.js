//setting.js
const util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    logs: [],
    equipmentId: app.globalData.equipmentId
  },
  bindKeyInput:function(e){
    // console.log(e.detail.value)
    app.globalData.equipmentId = e.detail.value
  },
  onLoad: function () {
  }
})
