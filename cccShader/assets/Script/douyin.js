//抖音
cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true
    },

    properties: {
        u_angle:{
            default:0,
            type:cc.Integer,
            range:[0,360,1],
            slide:true,
        },

        u_scale:{
            default:0,
            type:cc.Float,
            range:[0,10,0.001],
            slide:true,
        },
    },
    onLoad() {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0)
        this.time = 0
        this.material.setProperty("u_angle",this.u_angle)
        this.flag = false
    },
   
   

    update(dt){
        this.time+=dt
        let scale = 0.001*Math.sin(this.u_scale+30*this.time)
        this.material.setProperty("u_scale", scale)
    }
});