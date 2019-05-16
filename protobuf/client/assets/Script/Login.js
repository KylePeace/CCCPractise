var pm  = new (require("./protobufManager"))()
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World 3!'
    },

    // use this for initialization
    onLoad: function () {
        


        this.label.string = this.text;
        this.ws = new WebSocket("ws://192.168.1.46:5000");
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };
        this.ws.onmessage = function (event) {
            let res = JSON.parse(event.data)
            let data =  pm.decode(res.msgName,res.data)
            console.log("response text msg2: " + data);

        };
        this.ws.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        this.ws.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };
       
        // setTimeout(function () {
        //     if (ws.readyState === WebSocket.OPEN) {
        //         ws.send("Hello WebSocket, I'm a text message.");
        //     }
        //     else {
        //         console.log("WebSocket instance wasn't ready...");
        //     }
        // }, 3);
    },

    onStart(){

    },

    btClick(){
        
        let data =  pm.encode("LoginRequest",{})
        let sendData = {
            "msgName":"LoginRequest",
            data:data
        }

        
        this.ws.send(JSON.stringify(sendData))
    },

    onDestroy(){
        this.ws.close()
    },

    loginResponse(data){

    }
});
