
cc.Class({
    extends: cc.Component,

    properties: {
   
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._time = 0;
        this._sin = 0;
        this.sprite = this.node.getComponent(cc.Sprite);

        // this.sprite.setMaterial(0, this.materials)
        this.isDt = true
    },

    start () {

    },

    update (dt) {
        if(!this.isDt)return 
        this._time += dt;
        this._sin = this._time;
        this.sprite.getMaterial(0).setProperty("u_time",this._sin)
    },

    stopBtn(){
        this.isDt = ! this.isDt
    }
});
