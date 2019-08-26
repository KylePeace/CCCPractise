

var  funs1 = require("funs")
var funs = new funs1()
cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad(){
        this.shapeType = -1
    },

    start () {
        // cc.log(CANNON)
        // let world = new CANNON.World()
        // world.gravity.set(0, -100, 0)
        // world.broadphase = new CANNON.NaiveBroadphase()

        // let sphereShape = new CANNON.Sphere(5) // Step 1
        // var sphere_cm = new CANNON.Material()
        // this.sphereBody = new CANNON.Body({ // Step 2
        //     mass: 20,
        //     position: new CANNON.Vec3(400, 1000, 0),
        //     shape: sphereShape,
        //     material:sphere_cm
        // })

        // world.add(this.sphereBody) // Step 3
        //         // 平面 Body

       
        
        // var ground_cm = new CANNON.Material()
        // let groundShape = new CANNON.Box(new CANNON.Vec3(10000, 1, 10000))
        // this.groundBody = new CANNON.Body({
        //     mass: 0,
        //     shape: groundShape,
        //     position: new CANNON.Vec3(0, 0, 0),
        //     material: ground_cm
        // })
        // this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI/4)

        // var sphere_ground = new CANNON.ContactMaterial(ground_cm, sphere_cm, {
        //     friction: 1,
        //     restitution: 0
        // })  
        // world.addContactMaterial(sphere_ground)
        // // setFromAxisAngle 旋转 X 轴 -90 度

        // world.add(this.groundBody)

        // this.world = world
        
        // 创建长方体顶点数据
        let data = cc.primitive.box(200, 200, 200);
        // 根据顶点数据创建网格
        let mesh =funs.createMesh(data, cc.color(100, 100, 100));
        // 将创建的网格设置到 Mesh Renderer 上
        let renderer = this.getComponent(cc.MeshRenderer);
        renderer.mesh = mesh;
        this.node.position = cc.v3(0,0,0)
    },



    createBox(data){
        this.shapeType = shape.box
        let primitiveData = cc.primitive.box(data.w, data.h, data.L);
        let mesh =funs.createMesh(primitiveData,data.color);
        let renderer = this.getComponent(cc.MeshRenderer);
        renderer.mesh = mesh;
        this.node.position = cc.v3(0,0,0)
    },

    createSphere(data){

    }
});
