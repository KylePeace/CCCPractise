
window.shaders = {}

//顶点着色
shaders.vertexShaderSource = `
    attribute vec2 a_position;
    uniform mat3 u_matrix;
    void main() {
        // 使位置和矩阵相乘
        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    }
`
//片段着色器
shaders.fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`

