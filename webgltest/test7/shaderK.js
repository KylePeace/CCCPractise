
window.shaders = {

}

shaders.vertexShaderSource = `
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform float u_flipY;

varying vec2 v_texCoord;
void main() {

    //---坐标原点的转换start-----------
    // convert the rectangle from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;
 
    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;
    //---坐标原点的转换end-----------

    gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);
 
    // 将纹理坐标传给片断着色器
    // GPU会在点之间进行插值
    v_texCoord = a_texCoord;
}
`

shaders.fragmentShaderSource = `

precision mediump float;

// 纹理
uniform sampler2D u_image;
uniform vec2 u_textureSize;
uniform float u_kernel[9];
uniform float u_kernelWeight;

// 从顶点着色器传入的纹理坐标
varying vec2 v_texCoord;

void main() {
    // 计算1像素对应的纹理坐标
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

    vec4 colorSum =
    texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;

    gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1);
}

`

