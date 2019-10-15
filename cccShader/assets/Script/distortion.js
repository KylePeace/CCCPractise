//扭曲
cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true
    },

    properties: {
        distortion:{
            default:0,
            type:cc.Float,
            range:[0,10,0.01],
            slide:true,
        },
        distortion2:{
            default:0,
            type:cc.Float,
            range:[0,10,0.01],
            slide:true,
        },
        speed:{
            default:0,
            type:cc.Float,           
        },
        rollspeed:{
            default:0,
            type:cc.Float,           
        },
    },
    onLoad() {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0)
        this.time = 0
        this.material.setProperty("u_distortion",this.distortion)
        this.material.setProperty("u_distortion2",this.distortion2)
        this.material.setProperty("u_speed",this.speed)

        this.material.setProperty("u_rollspeed",this.rollspeed)
    },
   
    update(dt){
        this.time+=dt;
        this.material.setProperty("u_time",this.time)
    }
});