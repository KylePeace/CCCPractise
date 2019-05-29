
window.shaders = {}

//顶点着色
shaders.vertexShaderSource = `
    attribute vec4  a_position;
    attribute vec4  a_color;
    uniform mat4  u_matrix;
    varying vec4 v_color;

    void main() {
        // 使位置和矩阵相乘
        gl_Position = u_matrix * a_position;
        v_color = a_color;
    }
`
//片段着色器
shaders.fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`

