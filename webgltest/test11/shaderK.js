
window.shaders = {}

//顶点着色
shaders.vertexShaderSource = `
    attribute vec2 a_position;

    uniform vec2 u_resolution;
    uniform vec2 u_translation;
    uniform vec2 u_rotation;
    uniform vec2 u_scale;


    void main() {
        //缩放
        vec2 scaledPosition = a_position*u_scale;
        //旋转
        vec2 rotationPosition = vec2(scaledPosition.x*u_rotation.y+scaledPosition.y * u_rotation.x,
            scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
            );

        // 加上平移量
        vec2 position = rotationPosition + u_translation;

        // convert the rectangle points from pixels to 0.0 to 1.0
        vec2 zeroToOne = position  / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
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

