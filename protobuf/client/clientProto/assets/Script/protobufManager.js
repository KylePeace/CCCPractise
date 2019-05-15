/**
/ pbjs -t static-module -w commonjs -o ../../assets/resources/proto/test.js test.proto
 * 
 * 
 */

const pbKeyArr = {
	"pb_Login":{
		0:"LoginRequest",
		1:"LoginResponse"
	}
}



let msgNameIdx = {}
var protobufManager = function () {
	if(CC_EDITOR)return 

	for (const i in pbKeyArr) {
		let pbkey = pbKeyArr[i]
		for (const j in pbkey) {
			msgNameIdx[pbkey[j]] = require(i)[i+"package"][pbkey[j]]
		}
	}
};


protobufManager.prototype.encode = function (msgType, data) {
	let errMsg = msgNameIdx[msgType].verify(data)
	if (errMsg) return null

	var message = msgNameIdx[msgType].create(data); // or use .fromObject if conversion is necessary
	var buffer = msgNameIdx[msgType].encode(message).finish();
    var dst = new Uint8Array(buffer);

	return dst
}

protobufManager.prototype.decode = function (msgType, data) {
    var dst = new Uint8Array(data);
	var message = msgNameIdx[msgType].decode(dst);
	return message
}


module.exports = protobufManager;