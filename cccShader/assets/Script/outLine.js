
cc.Class({
    extends: cc.Component,

    properties: {
   
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.node.getComponent(cc.Sprite)){
            this.com = this.node.getComponent(cc.Sprite)
        }else if(this.node.getComponent(cc.Label)){
            this.com = this.node.getComponent(cc.Label)
        }
        this.material = this.com.getMaterial(0)
        
    },
    start () {
    
        // let textureSize    = new Float32Array(2)
        // textureSize[0]     =  this.node.getContentSize().width
        // textureSize[1]     =  this.node.getContentSize().height
        

        let textureSize    = new Float32Array(2)
        textureSize[0]     =  228
        textureSize[1]     =  159
        this.material.setProperty("u_textureSize",textureSize)
    },

   
});
