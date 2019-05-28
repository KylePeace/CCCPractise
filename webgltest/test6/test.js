/* eslint no-console:0 consistent-return:0 */
"use strict";

let vertexShaderSource = `
	attribute vec2 a_position;
	attribute vec2 a_texCoord;

	uniform vec2 u_resolution;

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

		gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
	 
		// 将纹理坐标传给片断着色器
		// GPU会在点之间进行插值
		v_texCoord = a_texCoord;
	}
`

let fragmentShaderSource = `
    
	precision mediump float;

	// 纹理
	uniform sampler2D u_image;
	uniform vec2 u_textureSize;

	// 从顶点着色器传入的纹理坐标
	varying vec2 v_texCoord;

	void main() {
		// 计算1像素对应的纹理坐标
		vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
		// 在纹理上寻找对应颜色值
		// 对左中右像素求均值
		gl_FragColor = (
			texture2D(u_image, v_texCoord) +
			texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) +
			texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))) / 20.0;
	}

`



function initGl() {
	var canvas = document.getElementById("c");
	var gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}

	// 查找顶点数据所需的位置。
	let data = [{
			"shaderSource": vertexShaderSource,
			"shadertype": "vert"
		},
		{
			"shaderSource": fragmentShaderSource,
			"shadertype": "frag"
		}
	]
	var program = webglUtils.createProgramFromScripts(gl, data);
	return {
		"gl": gl,
		"program": program
	}
}

function main() {
	var image = new Image();
	image.src = "http://192.168.1.46:8080/image/cocos.png"; // MUST BE SAME DOMAIN!!!
	image.onload = function () {
		render(image);
	};
}


function render(image) {
	// Get A WebGL context
	let data = initGl()
	let gl = data.gl
	let program = data.program

	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");
	var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
	// Create a buffer.
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	setRectangle(gl, 0, 0, image.width, image.height)

	// provide texture coordinates for the rectangle.
	var texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		1.0, 1.0,
	]), gl.STATIC_DRAW);

	// Create a texture.
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Set the parameters so we can render any size image.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	// Upload the image into the texture.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	// lookup uniforms
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);
	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	// Clear the canvas
	gl.clearColor(0.1, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);
// 设置图像的大小
	// Turn on the position attribute
	gl.enableVertexAttribArray(positionLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2; // 2 components per iteration
	var type = gl.FLOAT; // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
	// Turn on the teccord attribute


	gl.enableVertexAttribArray(texcoordLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);


	// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2; // 2 components per iteration
	var type = gl.FLOAT; // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(
		texcoordLocation, size, type, normalize, stride, offset);

	// set the resolution
	gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

	//set the size of the image
	gl.uniform2f(textureSizeLocation, image.width, image.height);
	
	// Draw the rectangle.
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6;
	gl.drawArrays(primitiveType, offset, count);

}

function randomInt(range) {
	return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
	var x1 = 0;
	var x2 = x + width;
	var y1 = 0;
	var y2 = y + height;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2,

	]), gl.STATIC_DRAW);
}

// 定义一个三角形填充到缓冲里
function setGeometry(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			-150, -100,
			150, -100,
			-150, 100,
			150, -100,
			-150, 100,
			150, 100
		]),
		gl.STATIC_DRAW);
}


// Fill the buffer with colors for the 2 triangles
// that make the rectangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setColors(gl) {
	// Pick 2 random colors.
	var r1 = Math.random();
	var b1 = Math.random();
	var g1 = Math.random();
	var r2 = Math.random();
	var b2 = Math.random();
	var g2 = Math.random();

	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(
			[Math.random(), Math.random(), Math.random(), 1,
				Math.random(), Math.random(), Math.random(), 1,
				Math.random(), Math.random(), Math.random(), 1,
				Math.random(), Math.random(), Math.random(), 1,
				Math.random(), Math.random(), Math.random(), 1,
				Math.random(), Math.random(), Math.random(), 1
			]),
		gl.STATIC_DRAW);
}

main();