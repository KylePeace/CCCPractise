/**
/ pbjs -t static-module -w commonjs -o ../../assets/resources/proto/test.js test.proto
 * 
 * 
 */

let msgName = {}
let msgIdIdx  ={
	"100001":"LoginRequest",
	"100002":"LoginResponse",
	"LoginResponse":"100002",
	"LoginRequest" :"100001",
}

let pb = require("pb_Login")
var xxtea = require("xxtea")

let msgCode = "msgType"

var protobufManager = function () {
	if(CC_EDITOR)return 
	msgName["LoginRequest"] 	= pb["pb_Loginpackage"]["LoginRequest"]
	msgName["LoginResponse"]    = pb["pb_Loginpackage"]["LoginResponse"]
	let codeArr = pb["pb_Loginpackage"][msgCode]
	// for (const key in codeArr) {
	// 	if(msgName[key]){
	// 		msgIdIdx[codeArr[key]] = key
	// 		msgNameIdx[key] = codeArr[key]

	// 	}
	// }
};


protobufManager.prototype.encode = function (msgType, data) {
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

protobufManager.prototype.decode = function (receiveData) {

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