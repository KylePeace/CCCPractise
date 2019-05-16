var wss = new(require('ws')).Server({
	port: 5000
})
let users = {} // userID: webSocket
console.log("启动成功")

var pm  = new (require("./protobufManager"))()

wss.binaryType = 'arraybuffer';

let loginData = {
	code:0,
	name: "小李子",
	avatar: "www.baidu.com",
	country: 0
}

wss.on('connection', function (ws, req) {
	let userId = req.connection.remoteAddress + ":" + req.connection.remotePort
	ws.userId = userId
	users[userId] = ws
	console.log("新用户链接")
	ws.binaryType ='arraybuffer'

	ws.on('message', function (message, req) {
		console.log("收到消息为：", message, req)
		let data2 = pm.decode(message)
		if(data2.msgName == "LoginRequest"){
			let buffer = pm.encode("LoginResponse",loginData)
			ws.send(buffer)
		}
		// wss.clients.forEach(function each(client) {
		// 	let buffer = pm.encode("test",roleData)
		// 	if(data){
		// 		sendData = {"msgName": "RoleInfoRequest","data": buffer}
		// 	}
		// 	client.send(sendData); //广播
		// });
	})

	ws.on('close', function () {
		console.log("删除一个用户")
		delete users[userId]
	})
})

