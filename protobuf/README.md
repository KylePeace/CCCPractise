# CocosCreator 中使用protobuf

使用的工具
protobuf 的优点是（相比 XML）更小、更快、更简单

```txt
Cocos Creator 版本 2.1.1
protobufjs    版本 protobufjs@6.8.8
pb3
```

***

## 一 准备工作

### 1 安装protobufjs库

    server 目录下
    运行命令
    npm init
    npm install protobufjs
    npm install ws  //websocket 库文件

    client 目录下
    复制server目录下  ./node_modules/protobufjs/dis/minimal/protobuf.min.js
    复制server目录下  ./node_modules/long/long.js
    复制两个文件到client/Script/Lib文件夹下,cocos中设置为脚本插件

    这样基本的库文件就准备好了

### 2 编写.proto文件

pb_Login.proto 文件

```protobuf
    package pb_Loginpackage; //包名
    syntax = "proto3";      // 使用proto3 语法，不写就是默认proto2语法

    enum Country {    //枚举
        china = 0 ;
        other = 1;
    }

    enum ErrCode{
        success  = 0;
        fail  =1;
    }

    enum msgType{  // 自定义的协议码
        LoginRequest = 100001;
        LoginResponse = 100002;
    }

    message LoginRequest { //消息体  登录请求

    }

    message LoginResponse { // 消息  登录消息回应
        optional ErrCode code = 1;
        string name = 2;
        string avatar = 3;
        optional Country country = 4;
    }
```

具体的proto语法可参考[官方说明](https://developers.google.com/protocol-buffers/docs/proto3)

服务器可以直接加载文件

```javascript
let path = "./proto/pb_Login.proto"
protobuf.load(path,function(err, root) {

})
```

客户端:
因为cocos creator直接使用protobuf.load函数去加载.proto文件会报错，具体原因没有深究。
本文是利用protobufjs库提供的工具pbjs，将proto编译成js静态脚本
进入  node_modules/.bin 文件夹下 双击pbjs.cmd 等待安装完毕一些依赖文件

cmd 进入文件目录
拷贝 pb_Login.proto 到 node_modules/.bin  目下
执行以下语法

``` bat
cd  node_modules/.bin  
pbjs -t static-module -w commonjs -o pb_Login.js pb_Login.proto
```

生成pb_Login.js 拷贝到客户端的proto目录下
同时修改pb_Login.js 文件

```javascript
    //var $protobuf = require("protobufjs/minimal");//原先生成的代码
    var $protobuf = protobuf //修改
```

代码使用直接require就可以使用了

```javascript
    let pb = require("pb_Login")
```

至此pb工具文件使用完毕

***

## 二 实用websocket进行通信

### 1 websocket注意事项

binaryType要设置为arraybuffer

```javascript
wss.binaryType = 'arraybuffer';
```

Cocos Creator 中带有websocket,可以直接使用

```javascript
 this.ws = new WebSocket("ws://192.168.1.4:5000");
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = function (event) {

        };

        this.ws.onmessage = function (event) {
            let data =  pm.decode(event.data)
            if(data.msgName == "LoginResponse"){
                let message = data.data
                if(message.code == 1)return 
                this.nameL.string = message.name
                if(message.country == 0){
                    this.countryL.string = "china"
                }
                cc.loader.load(message.avatar, function (err, texture) {
                   this.avatar.SpriteFrame =  new cc.SpriteFrame(texture)
                });
            }
            console.log("response text msg2: " + data);

        }.bind(this);
        this.ws.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        this.ws.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };
```

### 2 demo主要功能

```sequence
   participant 客户端
   participant 服务器

    客户端->服务器: 登录请求(LoginRequest)
    服务器->客户端: 服务器回应(LoginResponse)
    客户端->客户端: UI刷新
```

登录界面
点击登录按钮
![初始界面](/image/初始界面.png)

登录成功界面
客户端收到消息
![登录成功](/image/登录成功.png)

在web端、ccc模拟器和微信小游戏端是可以成功通信的，原生没有测试，目测可以通信

### 3 protobuf数据序列化和反序列化

在protobufManager.js进行

序列化中，下面代码注释有详细说明

```javascript
    /*
    * msgType : 协议类型  LoginRequest
    * data    : 加密数据
    */
    protobufManager.prototype.encode = function(msgType,data){
        let errMsg = msgName[msgType].verify(data)//判断是否可以序列化
        if (errMsg) return null

        var message = msgName[msgType].create(data); //创建message实例
        var buffer = msgName[msgType].encode(message).finish();//序列化数据

        var protoTypeId = parseInt(msgIdIdx[msgType])//协议号

        //创建一个ArrayBuffer数据类型
        //长度为4+buffer的长度
        //前四个字节是协议号，后面是数据，其实还可以加一个数据长度(方便服务器解析)
        let byteArr =  new ArrayBuffer(4 + buffer.length);
        var dv = new DataView(byteArr);//作用是改变ArrayBuffer数据
        dv.setInt32(0, protoTypeId, true);//设置包头
        for (var i = 0; i < buffer.length; i++) {
            dv.setUint8(4 + i, buffer[i], true);
        }
        return byteArr
    }
```

反序列化,安装序列化得方式解码就可以了

```javascript
protobufManager.prototype.decode = function (receiveData) {
    var dv = new DataView(receiveData);
    var protoTypeId = dv.getInt32(0, true);//取出包头协议号
    var data = [];
    var len = receiveData.byteLength - 4
    for (var i = 0; i < len; i++) {//取出字节数组
        data[i] = dv.getUint8(4 + i);
    }
    var message = msgName[msgIdIdx[protoTypeId]].decode(data);//反序列化
    return {msgName:msgIdIdx[protoTypeId],data:message}
}
```

至此，通信方式基本完成

如遇问题可以添加公众号关注回复或者添加微信询问
![2code](/image/2code.jpg)![wx2code](/image/wx2code.jpg)

转载请注明作者和出处