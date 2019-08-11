let gfx = cc.gfx;

cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true
    },

    properties: {
        upCol: cc.Color,
        downCol: cc.Color,
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


        this.vertexes = [
            cc.v2(0, 0), cc.v2(960, 0),
            cc.v2(960, 640),cc.v2(0,640)
        ];
        //设置定点坐标
        mesh.setVertices(gfx.ATTR_POSITION, this.vertexes);
        mesh.setVertices(gfx.ATTR_UV0, [
            cc.v2(0,1), cc.v2(1, 1),
            cc.v2(1, 0), cc.v2(0, 0),
        ]);
        // 修改 color 顶点颜色  255,255,255  000
        mesh.setVertices(gfx.ATTR_COLOR, [
            this.downCol, this.downCol,
            this.upCol, this.upCol, 
        ]);


        mesh.setIndices([ //顶点顺序
            1,0,2,
            0,3,2,
           
        ]);

        let renderer = this.node.getComponent(cc.MeshRenderer);
        if (!renderer) {
            renderer = this.node.addComponent(cc.MeshRenderer);
        }
        renderer.mesh = mesh;
       // this.mesh = mesh;



    },

});