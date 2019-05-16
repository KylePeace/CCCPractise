var pm  = new (require("./protobufManager"))()
cc.Class({
    extends: cc.Component,

    properties: {
        nameL: {
            default: null,
            type: cc.Label
        },
        countryL:{
            default: null,
            type: cc.Label
        },
        avatar:cc.Sprite
    },

    onLoad: function () {
        
        this.ws = new WebSocket("ws://192.168.1.46:5000");
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = function (event) {

        };

        this.ws.onmessage = function (event) {
            let data =  pm.decode(event.data)
            if(data.msgName == "LoginResponse"){
                let message = data.data
                if(message.code == 1)return 
                this.nameL.string = message.name
                if(message.country == 0){
                    this.countryL.string = "china"
                }
                cc.loader.load(message.avatar, function (err, texture) {
                   this.avatar.SpriteFrame =  new cc.SpriteFrame(texture)
                });
            }
            console.log("response text msg2: " + data);

        }.bind(this);
        this.ws.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        this.ws.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };
       
    },

    onStart(){

    },

    btClick(){
        
        let data =  pm.encode("LoginRequest",{})
        
        this.ws.send(data)
    },

    onDestroy(){
        this.ws.close()
    },

    loginResponse(data){

    }
});
