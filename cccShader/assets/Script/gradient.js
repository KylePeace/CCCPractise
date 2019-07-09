//todo 后期会加入角度 
cc.Class({
    extends: cc.Component,

    properties: {
        materials:cc.Material,
        upCol:cc.Color,
        downCol:cc.Color

    },
    onLoad(){

        if(this.node.getComponent(cc.Sprite)){
            this.com = this.node.getComponent(cc.Sprite)
        }else if(this.node.getComponent(cc.Label)){
            this.com = this.node.getComponent(cc.Label)
        }
        this.com.setMaterial(0, this.materials)
        this.setColor()
    },

    setColor(up,down){
        this.upColor    = new Float32Array(4)
        this.upColor[0] =  this.upCol.r/255
        this.upColor[1] =  this.upCol.g/255
        this.upColor[2] =  this.upCol.b/255
        this.upColor[3] =  this.upCol.a/255


        this.downColor    = new Float32Array(4)
        this.downColor[0] =  this.downCol.r/255
        this.downColor[1] =  this.downCol.g/255
        this.downColor[2] =  this.downCol.b/255
        this.downColor[3] =  this.downCol.a/255


        this.com.getMaterial(0).setProperty("u_upColor",this.upColor)
        this.com.getMaterial(0).setProperty("u_downColor",this.downColor)

    },

});
