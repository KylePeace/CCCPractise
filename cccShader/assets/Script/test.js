//抖音
cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true
    },

    properties: {
        camera:cc.Camera
    },
    onLoad() {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            let pos = this.node.convertToNodeSpaceAR( event.getLocation() );
            this.material.setProperty("u_touch", cc.v2((pos.x+320)/640,(-pos.y+320)/640))
        }, this);

        this.renderTexture =  new cc.RenderTexture()
        let gl = cc.game._renderContext;
        let width = 640;
        let height = 640;
        this.renderTexture.initWithSize(width, height,gl.STENCIL_INDEX8);
        this.camera.targetTexture = this.renderTexture;
    },
   
    update(dt){
        
    }
});