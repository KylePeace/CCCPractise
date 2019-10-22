//抖音
cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true
    },

    properties: {
  
    },
    onLoad() {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            let pos = this.node.convertToNodeSpaceAR( event.getLocation() );
            console.log('TOUCH_MOVE',cc.v2((pos.x+320)/640,(pos.y+320)/640));
            this.material.setProperty("u_touch", cc.v2((pos.x+320)/640,(pos.y+320)/640))
          }, this);
   
    },
   
    update(dt){
        
    }
});