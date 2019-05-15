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
	avatar: "www.test.com",
	country: 0
}

wss.on('connection', function (ws, req) {
	let userId = req.connection.remoteAddress + ":" + req.connection.remotePort
	ws.userId = userId
	users[userId] = ws
	console.log("新用户链接")
	ws.binaryType ='arraybuffer'

	//let buffer = pm.encode("RoleInfoRequest",roleData)
	// if(buffer){
	// 	sendData =JSON.stringify( {"msgName": "RoleInfoRequest","data": buffer})
	// }
	// let data = new Uint8Array(buffer)

	//ws.send(buffer);

	ws.on('message', function (message, req) {
		console.log("收到消息为：", message, req)
		message = JSON.parse(message)
		if(message.msgName == "LoginRequest"){
			let buffer = pm.encode("LoginResponse",loginData)
			let len = buffer.length
			var byteArr = new ArrayBuffer(4 + len);
			var dv = new DataView(byteArr);
			dv.setInt32(0, len, true);
			for (var i = 0; i < len; i++) {
                dv.setUint8(4 + i, buffer[i], true);
			}
			
			let data ={"msgName":"LoginResponse",data:buffer}
			let data2 = JSON.stringify(data)
			ws.send(data2)
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

