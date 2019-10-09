
cc.Class({
    extends: cc.Component,

    properties: {
        carCamera: cc.Node,
        carBody:cc.RigidBody,
        upBtn:cc.Button,
        downBtn:cc.Button,
        rightBtn:cc.Button,
        leftBtn:cc.Button,
        motionStreak1:cc.MotionStreak,
        motionStreak2:cc.MotionStreak,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isUp = false
        this.isDown = false
        this.isRight = false
        this.isLeft = false
        this.isMove = false
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.upBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) { this.onKeyDown({keyCode:38}) },this);
        this.downBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) { this.onKeyDown({keyCode:40}) },this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) { this.onKeyDown({keyCode:39}) },this);
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) { this.onKeyDown({keyCode:37}) },this);

        this.upBtn.node.on(cc.Node.EventType.TOUCH_END, function (event) { this.onKeyUp({keyCode:38}) },this);
        this.downBtn.node.on(cc.Node.EventType.TOUCH_END, function (event) { this.onKeyUp({keyCode:40}) },this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_END, function (event) { this.onKeyUp({keyCode:39}) },this);
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_END, function (event) { this.onKeyUp({keyCode:37}) },this);

        this.upBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) { this.onKeyUp({keyCode:38}) },this);
        this.downBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) { this.onKeyUp({keyCode:40}) },this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) { this.onKeyUp({keyCode:39}) },this);
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) { this.onKeyUp({keyCode:37}) },this);
    },

    start () {
    },

    onBeginContact: function (contact,selfCollider,otherCollider) {
        console.log(otherCollider.node.name,'on collision enter',selfCollider.node.name);
    },

    onKeyDown:function(event) {
        // console.log("onKeyDown: ",event)
        switch (event.keyCode) {
            case 37:    //左
                this.isLeft = true
                break;
            case 38:    //上
                this.isUp = true
                break;
            case 39:    //右
                this.isRight = true
                break;
            case 40:    //下
                this.isDown = true
                break;
            default:
                break;
        }
    },

    onKeyUp:function(event){
        // console.log("onKeyUp: ",event)
        switch (event.keyCode) {
            case 37:    //左
                this.isLeft = false
                break;
            case 38:    //上
                this.isUp = false
                break;
            case 39:    //右
                this.isRight = false
                break;
            case 40:    //下
                this.isDown = false
                break;
        
            default:
                break;
        }
    },

    update (dt) {
        let force = 3000
        this.carBody.linearDamping = 4
        if (this.isUp) {
            // console.log("rotation",this.carBody.node.angle)
            let forceY = force * Math.cos(this.carBody.node.angle*3.14159/180)
            let forceX = force * Math.sin(this.carBody.node.angle*3.14159/180)
            // console.log("applyForceToCenter: ",forceY,forceX)
            this.carBody.applyForceToCenter(cc.v2(-forceX,forceY))
            this.carBody.linearDamping = 2
        }
        if (this.isDown) {
            // console.log("rotation",this.carBody.node.angle)
            let forceY = -force * Math.cos(this.carBody.node.angle*3.14159/180)
            let forceX = -force * Math.sin(this.carBody.node.angle*3.14159/180)
            // console.log("applyForceToCenter: ",forceY,forceX)
            this.carBody.applyForceToCenter(cc.v2(-forceX,forceY))
            this.carBody.linearDamping = 2
        }
        
        let tempIsMove = 0
        if ( !this.isDown && !this.isUp && this.carBody.linearVelocity.x < 30 && this.carBody.linearVelocity.x > -30) {
            
        }else{
            tempIsMove++
        }
        if ( !this.isDown && !this.isUp && this.carBody.linearVelocity.y < 30 && this.carBody.linearVelocity.y > -30) {
            
        }else{
            tempIsMove++
        }
        if (tempIsMove >= 1) {
            if (this.isRight ) {
                this.carBody.applyTorque(-1600)
            }
            if (this.isLeft) {
                this.carBody.applyTorque(1600)
            }
        }
        // console.log(this.carBody.linearVelocity)
    },
});
