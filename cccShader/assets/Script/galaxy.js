
cc.Class({
    extends: cc.Component,

    properties: {
	
    },
    onLoad(){
        this._time = 0;
        this._sin = 0;
      

        this.sprite = this.node.getComponent(cc.Sprite);
		// this.material["_props"]["sys_time"] = this._time;
		// this.sprite["_materials"][0] = this.material;
    },


    start () {
      
    },
    setColor(){

    },

    update (dt) {
        this._time += dt;
        this._sin = Math.sin(this._time);
        if(this._sin > 0.99){
            this._sin = 0;
            this._time = 0;
        }
 

    this.sprite["_materials"][0].effect.setProperty("sys_time",this._time)

    },
});
