# soft-and-hard
nodb分支：没有数据库的平替版本，用于节约部署数据库的资源，使其在轻量云上也可以运行。


## 其它说明
- 此项目仅包含代码，教程文章都存放于个人博客项目中（基于hexo搭建的博客）：[https://github.com/alwxkxk/blog](https://github.com/alwxkxk/blog)
<!-- - 这个教程之前是要本地浏览的形式做的，需要读者先clone此项目到本地，才能进行阅读，但发现好多新手会卡在github上。[旧版教程备份（已弃用）-百度云](https://pan.baidu.com/s/1TcUtfI5hFedj_RL6j8QacQ)
- 为了降低阅读门槛，我重新制作并发布在线教程。[软硬结合-在线访问](https://www.scaugreen.cn/posts/44755/) -->

### 文件目录说明
- 基础教程 : 各基础教程代码。详情查看该目录下的README.md。
- demo1 ：demo1的源代码，详情查看该目录下的README.md。
- demo2 : demo2的源代码，包含微信小程序、electron源代码，详情查看该目录下的README.md。
- pm2.json : 使用pm2启动时的配置文件`pm2 start pm2.json`，启动前需要先安装项目依赖。

### 端口使用情况
- demo0.1-tcp: 9000
- demo0.1-http: 8000

- base-tcp1: 9001 （方便TCP基础学习时抓包所用。）

- demo1-tcp: 9002
- demo1-http: 8001

- demo2-tcp: 9003
- demo2-http: 8002




