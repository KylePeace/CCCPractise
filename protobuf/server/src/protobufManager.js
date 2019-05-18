
var fs = require("fs")
var protobuf = require("protobufjs")

let msgName ={}
let msgIdIdx  ={
	"100001":"LoginRequest",
	"100002":"LoginResponse",
	"LoginResponse":"100002",
	"LoginRequest" :"100001",


}

var protobufManager = function () {
	this.messageArray = {}
	
	let path = "../proto/pb_Login.proto"
	protobuf.load(path,function(err, root) {
		if (err)throw err;
		var message1 = root.lookupType("LoginRequest");
		msgName[message1.name] = message1
		var message2 = root.lookupType("LoginResponse");
		msgName[message2.name] = message2
	})
	
};


protobufManager.prototype.encode = function(msgType,data){
    let errMsg = msgName[msgType].verify(data)
	if (errMsg) return null

	var message = msgName[msgType].create(data); 
	var buffer = msgName[msgType].encode(message).finish();

	var protoTypeId = parseInt(msgIdIdx[msgType])

	let byteArr =  new ArrayBuffer(4 + buffer.length);
	var dv = new DataView(byteArr);
	dv.setInt32(0, protoTypeId, true);
	for (var i = 0; i < buffer.length; i++) {
		dv.setUint8(4 + i, buffer[i], true);
	}

	return byteArr
}

protobufManager.prototype.decode = function(receiveData){
	var dv = new DataView(receiveData);

	var protoTypeId = dv.getInt32(0, true);
	var data = [];
	var len = receiveData.byteLength - 4 
	for (var i = 0; i < len; i++) {
		data[i] = dv.getUint8(4 + i);
	}
	var message = msgName[msgIdIdx[protoTypeId]].decode(data);
    return {msgName:msgIdIdx[protoTypeId],data:message}
}


module.exports = protobufManager;