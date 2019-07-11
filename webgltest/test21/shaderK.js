
window.shaders = {}

//顶点着色
shaders.vertexShaderSource = `
    attribute  vec4  a_position;
    attribute  vec3 a_normal;

    //一个光源位置
    uniform vec3 u_lightWorldPosition;

    //世界矩阵
    uniform mat4 u_world;


    uniform mat4 u_worldViewProjection;//世界矩阵，用来确定位置
    uniform mat4 u_worldInverseTranspose;

    varying vec3 v_normal;

    varying vec3 v_surfaceToLight;

    void main() {
        // 使位置和矩阵相乘
        gl_Position = u_worldViewProjection*a_position;

        // 重定向法向量并传递给片断着色器
        v_normal = mat3(u_worldInverseTranspose) * a_normal;

        // 计算表面的世界坐标
        vec3 surfaceWorldPosition = (u_world * a_position).xyz;
       
        // 计算表面到光源的方向
        // 传递给片断着色器
        v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
    }
`
//片段着色器
shaders.fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_normal;
    varying vec3 v_surfaceToLight;

    uniform vec4 u_color;

    void main() {
        // 由于 v_normal 是插值出来的，和有可能不是单位向量，
        // 可以用 normalize 将其单位化。
        vec3 normal = normalize(v_normal);
        vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
        float light = dot(normal, surfaceToLightDirection);

        gl_FragColor = u_color;
        // 将颜色部分（不包括 alpha）和 光照相乘
        gl_FragColor.rgb *= light;
    }
`

