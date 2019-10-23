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
            range:[0,10,0.1],
            slide:true,
        },
        u_speed:{
            default:0,
            type:cc.Float,
            range:[0,100,1],
            slide:true,
        },
    },
    onLoad() {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0)
        this.time = 0
        this.material.setProperty("u_angle",this.u_angle)
        this.material.setProperty("u_scale",parseFloat(this.u_scale) )
        this.material.setProperty("u_speed",parseFloat(this.u_speed) )
    },

    update(dt){
        this.time+=dt
        this.material.setProperty("u_time", this.time)
    }
});