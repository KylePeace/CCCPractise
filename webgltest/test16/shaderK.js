
window.shaders = {}

//顶点着色
shaders.vertexShaderSource = `
    attribute vec4  a_position;
    attribute vec4  a_color;
    uniform mat4  u_matrix;
    varying vec4 v_color;
    void main() {
        // 使位置和矩阵相乘
        vec4 position = u_matrix*a_position;

        // x和y 除以调整后的除数
        gl_Position =position;
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

