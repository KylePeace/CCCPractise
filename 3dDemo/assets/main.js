
var  CANNON = require("cannon")

cc.Class({
    extends: cc.Component,

    properties: {
        sphere:cc.Node,
        plane:cc.Node
    },

    start () {
        cc.log(CANNON)
        let world = new CANNON.World()
        world.gravity.set(0, -100, 0)
        world.broadphase = new CANNON.NaiveBroadphase()

        let sphereShape = new CANNON.Sphere(5) // Step 1
        var sphere_cm = new CANNON.Material()
        this.sphereBody = new CANNON.Body({ // Step 2
            mass: 20,
            position: new CANNON.Vec3(400, 1000, 0),
            shape: sphereShape,
            material:sphere_cm
        })

        world.add(this.sphereBody) // Step 3
                // 平面 Body

       
        
        var ground_cm = new CANNON.Material()
        let groundShape = new CANNON.Box(new CANNON.Vec3(10000, 1, 10000))
        this.groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape,
            position: new CANNON.Vec3(0, 0, 0),
            material: ground_cm
        })
        this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI/4)

        var sphere_ground = new CANNON.ContactMaterial(ground_cm, sphere_cm, {
            friction: 1,
            restitution: 0
        })  
        world.addContactMaterial(sphere_ground)
        // setFromAxisAngle 旋转 X 轴 -90 度

        world.add(this.groundBody)

        this.world = world
        

    },

    update (dt) {
        this.world.step(dt)
        this.sphere.position = this.sphereBody.position
        this.sphere.eulerAngles  = this.sphereBody.quaternion
        // this.sphere.quaternion

    },
});
