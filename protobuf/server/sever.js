var wss = new (require('ws')).Server({port:5000})
let   users = {} // userID: webSocket
console.log("启动成功")

wss.on('connection', function (ws,req) {
  let userId = req.connection.remoteAddress+":"+req.connection.remotePort
  ws.userId = userId
  users[userId] = ws
  console.log("新用户链接")
  ws.on('message', function(message,req) {
    console.log("收到消息为：",message,req)
    wss.clients.forEach(function each(client) {
        client.send(message);//广播
    });
  })

  ws.on('close', function () {
    console.log("删除一个用户")
    delete users[userId]
  })
})
