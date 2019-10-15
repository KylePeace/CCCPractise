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
        this.time = 0
        
        this.flag = false
        this.schedule(()=>{
            if(!this.flag){
                if(this.time>0.001){
                    this.flag = true
                }
                this.time+=0.0001;
            }else{
                if(this.time<0){
                    this.flag = false
                }
                this.time-=0.0001;
            }
            this.material.setProperty("scale",this.time)
            
        },0.005)
    },
   
    update(dt){
        
    }
});