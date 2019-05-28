/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

let vertexShaderSource= `
    // an attribute will receive data from a buffer

    attribute vec4 a_position;
    // all shaders have a main function
    void main() {

    // gl_Position is a special variable a vertex shader

    gl_Position = a_position;
    }
`



let fragmentShaderSource =`
    
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.2, 1); // return redish-purple
  }

`

let vertexShaderSource2= `
    attribute vec4 a_position;
    attribute vec2 a_position;

    uniform vec2 u_resolution;

    void main() {
    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // 再把 0->1 转换 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // 把 0->2 转换到 -1->+1 (裁剪空间)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
    }
`
let fragmentShaderSource2 =`
    
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.2, 1); // return redish-purple
  }

`

function main() {
    // Get A WebGL context
    var canvas = document.getElementById("c");
    //   var cxt=canvas.getContext("2d");
    //   cxt.width =400
    //   cxt.height =400
    //   cxt.fillStyle='rgba(225,225,225,0)';  
    //   cxt.fillRect(0,0,1000,1000);

    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Get the strings for our GLSL shaders
    // var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
    // var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;

    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
        -0.97777, 0,
        0, 0.97777,
        0.97777, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    // code above this line is initialization code. 上面是初始化代码
    // code below this line is rendering code.下面是渲染代码

    webglUtils.resizeCanvasToDisplaySize(gl.canvas,1);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    //gl.viewport(0, 0, 180, 320);

    // Clear the canvas 我感觉就是设置canvas颜色
    gl.clearColor(0, 0.1, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

main();