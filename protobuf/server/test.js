var fs = require("fs")
protobuf = require("protobufjs")

// console.log(protobuf)

// userProtoStr = fs.readFileSync('./proto/lm.proto').toString()

protobuf.load("./proto/awesome.proto", function(err, root) {
	  if (err)
        throw err;

    // Obtain a message type
    var AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");
    // Exemplary payload
    var payload = { awesomeField: "你是谁" };

    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    var errMsg = AwesomeMessage.verify(payload);
    if (errMsg)
        throw Error(errMsg);

    // Create a new message
    var message = AwesomeMessage.create(payload); // or use .fromObject if conversion is necessary
    console.log(message)

    // Encode a message to an Uint8Array (browser) or Buffer (node)
    var buffer = AwesomeMessage.encode(message).finish();
    console.log("1+",buffer)

    // ... do something with buffer

    // Decode an Uint8Array (browser) or Buffer (node) to a message
    var message = AwesomeMessage.decode(buffer);
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