// 获取DOM对象
var lightDOM = document.getElementById('open-light-number')
// 随机生成数字并赋值到网页
function generaterNumber () {
  var number, random
  random = Math.random() * 1000
  // 不要小数
  number = random.toFixed(0)
  lightDOM.innerText = number
  console.log('生成的随机数：', number)
}

// 每五秒调用一次 生成随机数 。
setInterval(generaterNumber, 1000)
