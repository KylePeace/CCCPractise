let gfx = cc.gfx;

cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true
    },

    properties: {
        color: cc.Color,
    },
    onLoad() {
        // cc.macro.SHOW_MESH_WIREFRAME = true

    },
    start() {
        //定义顶点数据格式，只需要指明所需的属性，避免造成存储空间的浪费
        var vfmt = new gfx.VertexFormat([{
                //位置信息
                name: gfx.ATTR_POSITION,
                type: gfx.ATTR_TYPE_FLOAT32,//数据类型
                num: 2  //2个值 x,y  三维就是三个  x,y,z
            },
            {   //UV信息
                name: gfx.ATTR_UV0,
                type: gfx.ATTR_TYPE_FLOAT32,
                num: 2
            },
            {   //颜色信息
                name: gfx.ATTR_COLOR,
                type: gfx.ATTR_TYPE_UINT8, //
                num: 4,
                normalize: true
            },

        ]);

        //根据顶点格式初始化顶点内存
        let mesh = new cc.Mesh();
        mesh.init(vfmt, 4, false);
       // this.mesh = mesh;


        // this.vertexes = [
        //     cc.v2(-480, -320), cc.v2(480, -320), cc.v2(-480, 320),
        //     cc.v2(480, 320),cc.v2(480, 320), cc.v2(-480, 320)
        // ];


        // this.vertexes = [
        //     cc.v2(-300, -200), cc.v2(300, -200),
        //     cc.v2(300, 200),cc.v2(-300,200)
        // ];

        let R = 200
        let rad = Math.PI/180
        // this.vertexes = [
        //     cc.v2(R*Math.cos(rad*90), R*Math.sin(rad*90)),
        //     cc.v2(R*Math.cos(rad*90+66), R*Math.sin(rad*90+66)), 
        //     cc.v2(R*Math.cos(rad*90), R*Math.sin(rad*90)), 
        //     cc.v2(R*Math.cos(rad*90), R*Math.sin(rad*90)), 
        //     cc.v2(R*Math.cos(rad*90), R*Math.sin(rad*90)), 

        // ];
        this.vertexes = []
        for (let i = 0; i < 6; i++) {
            let pos1 = R*Math.cos(rad*(90+66*i))
            let pos2 = R*Math.sin(rad*(90+66*i))
            this.vertexes.push(cc.v2(pos1,pos2 ))
        }

        mesh.setVertices(gfx.ATTR_POSITION, this.vertexes);
        // mesh.setVertices(gfx.ATTR_UV0, [
        //     cc.v2(0,1), cc.v2(1, 1),
        //     cc.v2(1, 0), cc.v2(0, 0),
        // ]);
        
        mesh.setVertices(gfx.ATTR_COLOR, [
            this.color, this.color,
            this.color, this.color, 
            this.color,this.color
        ]);


        mesh.setIndices([ //顶点顺序
            0,1,3,
            0,2,4,
            4,1,2,
            0,2,3,
           
        ]);

        let renderer = this.node.getComponent(cc.MeshRenderer);
        if (!renderer) {
            renderer = this.node.addComponent(cc.MeshRenderer);
        }
        renderer.mesh = mesh;
       // this.mesh = mesh;



    },

});