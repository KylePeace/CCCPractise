require("funs")
let CANNON = require("cannon")
cc.Class({
    extends: cc.Component,

    properties: {
        modlePf:cc.Prefab,
        modleParent:cc.Node
    },
    onLoad(){
        console.log(funs)
        console.log(shape)

    },

    start () {
        cc.macro.SHOW_MESH_WIREFRAME = true;
        this.world = new CANNON.World()
        this.world.gravity.set(0, -100, 0)
        this.world.broadphase = new CANNON.NaiveBroadphase() //碰撞检测方式
        this.init()
    },

    init(){
        let box = cc.instantiate(this.modlePf)
        box.parent = this.modleParent
        let data  ={
            w:300,
            h:300,
            l:300,
            color:cc.color(100, 200, 100)
        }
        box.getComponent("modle").createBox(data)

    }

    

});
