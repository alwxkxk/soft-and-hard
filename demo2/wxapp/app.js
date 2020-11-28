//app.js
// 本地开发模式时，websocket与RESTful API 全部指向127.0.0.1
let localDev= true

App({
  onLaunch: function () {
  },
  globalData: {
    // 初期调试时可以设置不检验合法域名，否则调用API时需要设置小程序的request、socket合法域名
    // 本机调试需要本机运行demo2，然后将API指向127.0.0.1
    // 网上调试必须使用ssl，所以我额外申请了sh.scaugreen.cn域名并配置了SSL证书。
    websocketURL: localDev ? 'ws://127.0.0.1:8002' : 'wss://sh.scaugreen.cn',
    requestHost: localDev ? 'http://127.0.0.1:8002' : 'https://sh.scaugreen.cn',
    equipmentId: '123456'
  }
})