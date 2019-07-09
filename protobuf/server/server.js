var wss = new(require('ws')).Server({
	port: 5000
})
let users = {} // userID: webSocket
console.log("启动成功")

var pm  = new (require("./src/protobufManager"))()

wss.binaryType = 'arraybuffer';

let loginData = {
	code:0,
	name: "火箭必赢",
	avatar: "www.baidu.com",
	country: 0
}
function RandomNumBoth(Min,Max){
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range); //四舍五入
	return num;
}
let namelist = ["火箭必赢","湖人必赢","勇士必输"]


wss.on('connection', function (ws, req) {
	let userId = req.connection.remoteAddress + ":" + req.connection.remotePort
	ws.userId = userId
	users[userId] = ws
	console.log("新用户链接")
	ws.binaryType ='arraybuffer'

	ws.on('message', function (message, req) {
		console.log("收到消息为：", message, req)
		loginData.name = namelist[RandomNumBoth(0,namelist.length)] + new Date().getSeconds()
		let data2 = pm.decode(message)
		if(data2.msgName == "LoginRequest"){
			let buffer = pm.encode("LoginResponse",loginData)
			ws.send(buffer)
		}

		////广播
		// wss.clients.forEach(function each(client) {
		// 	let buffer = pm.encode("test",roleData)
		// 	if(data){
		// 		sendData = {"msgName": "RoleInfoRequest","data": buffer}
		// 	}
		// 	client.send(sendData); //广播
		// });
	})

	ws.on('close', function () {
		console.log("一个用户关闭连接")
		delete users[userId]
	})
})

