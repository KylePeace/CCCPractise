var fs = require("fs")
protobuf = require("protobufjs")
function test(){
    let str = "test"

    let protoType = parseInt(10001)

    var byteArr = new ArrayBuffer(4 + 4);
    var dv = new DataView(byteArr);
    dv.setInt32(0, protoType, true);
    var v1 = dv.getInt32(0,true);


    console.log(byteArr)
}
test()
protobuf.load("./proto/test.proto", function(err, root) {
	  if (err)
        throw err;

    // Obtain a message type
     var AwesomeMessage = root.lookupType("Testpackage.RoleInfoRequest");

    // // Exemplary payload
    var payload = { name: "小李子" ,
                    avatar:"www.test.com",
                    country:0
    };
   
    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    var errMsg = AwesomeMessage.verify(payload);
    if (errMsg)
        throw Error(errMsg);

    // Create a new message
    var message = AwesomeMessage.create(payload); // or use .fromObject if conversion is necessary
    console.log(message)
    
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    var buffer = AwesomeMessage.encode(message).finish();
    let dv = new DataView(buffer.buffer)
    var v1 = dv.getUint8(0);
    dv.setInt32(0, 25, false);

    buffer = new Uint8Array(buffer);
   
    console.log("1+",buffer)

    // ... do something with buffer

    var dst = new ArrayBuffer(buffer.byteLength);
    dst = new Uint8Array(buffer)
    console.log("dst",dst)

    var message = AwesomeMessage.decode(dst);
    console.log("2+",message)

   

    // ... do something with message

    // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.

    // Maybe convert the message back to a plain object
    // var object = AwesomeMessage.toObject(message, {
    //     longs: String,
    //     enums: String,
    //     bytes: String,
    //     // see ConversionOptions
    // });
	// console.log("22",object)

})


// UserModel = ProtoBuf.load(userProtoStr).build('protobuf').UserModel
// userModel;
 
// userModel= new UserModel();
// userModel.set('cyUserno', '111111');
// userModel.set('cyPassWord', '123456');
// userModel.set('cyStatus', '1');
 
// var buffer = userModel.encode().toBuffer()