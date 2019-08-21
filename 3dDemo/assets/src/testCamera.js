
cc.Class({
    extends: cc.Component,

    properties: {
        sp:cc.Sprite,
        camera:cc.Camera,
        color:cc.Color
    },


    start () {
        let c = new Float32Array(4)
        c[0] = this.color.r/255
        c[1] = this.color.g/255
        c[2] = this.color.b/255
        c[3] = this.color.a/255

        this.sp.getMaterial(0).setProperty("u_color", c)
        
        this.sprite =this.sp 
        this.texture = new cc.RenderTexture();
        this.texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);

        this.spriteFrame = new cc.SpriteFrame();
        // spriteFrame.setTexture(this.texture)
        this.sprite.spriteFrame = this.spriteFrame;
		this.spriteFrame.setTexture(this.texture);
        
        this.camera.targetTexture = this.texture;

       
    },

    snapshot(){
        this.spriteFrame.setTexture(this.texture)
		// this.spriteFrame.setTexture(this.texture);
    },
    update (dt) {
        this.snapshot()
    },
});
