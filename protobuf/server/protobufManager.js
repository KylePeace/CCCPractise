
var fs = require("fs")
var protobuf = require("protobufjs")

let msgNameIdx ={}

const pbKeyArr = {
	"pb_Login":{
		0:"LoginRequest",
		1:"LoginResponse"
	}
}


var protobufManager = function () {
	this.messageArray = {}
	for (const key in pbKeyArr) {
		let path = "./proto/"+key+".proto"
		protobuf.load(path,function(err, root) {
			if (err)throw err;
			console.log(key)
			for (const i in pbKeyArr[key]) {
				console.log(pbKeyArr[key][i])
				let str = key+"package."+pbKeyArr[key][i]
				var message = root.lookupType(str);
				msgNameIdx[message.name] = message
			}
		})
	}
};


protobufManager.prototype.encode = function(msgType,data){
    let errMsg = msgNameIdx[msgType].verify(data)
    if(errMsg) return null

    var message =  msgNameIdx[msgType].create(data); // or use .fromObject if conversion is necessary
    var buffer =  msgNameIdx[msgType].encode(message).finish();
    buffer = new Uint8Array(buffer);    // protobuf.Writer(buffer)
    return buffer
}

protobufManager.prototype.decode = function(msgType,data){
    var message = msgNameIdx[msgType].decode(data);
    return message
}


module.exports = protobufManager;