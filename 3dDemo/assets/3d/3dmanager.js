require("funs")
let CANNON = require("cannon")
cc.Class({
    extends: cc.Component,

    properties: {
        modlePf:cc.Prefab,
        modleParent:cc.Node
    },
    onLoad(){
     

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


        let plane = cc.instantiate(this.modlePf)
        plane.parent = this.modleParent
        let data2  ={
            w:3000000,
            l:3000000,
            color:cc.color(200, 100, 0)
        }
        plane.getComponent("modle").createPlane(data2)
        plane.y = 0

    }

    

});
