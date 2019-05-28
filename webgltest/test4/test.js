/* eslint no-console:0 consistent-return:0 */
"use strict";

//gl_Position 4位 四元数原因

let vertexShaderSource = `
	attribute vec2 a_position;

	uniform mat3 u_matrix;

	varying vec4 v_color;

	void main() {
		// 将位置和矩阵相乘
		gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

		// Convert from clipspace to colorspace.
		// Clipspace goes -1.0 to +1.0
		// Colorspace goes from 0.0 to 1.0
		// 从裁减空间转换到颜色空间
		// 裁减空间范围 -1.0 到 +1.0
		// 颜色空间范围 0.0 到 1.0
		v_color = gl_Position * 0.5 + 0.5;
	}
`

let fragmentShaderSource = `
    
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;
  varying vec4 v_color;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = v_color;
  }

`



function main() {
	// Get A WebGL context
	var canvas = document.getElementById("c");
	var gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}

	// 查找顶点数据所需的位置。
	let data=[
		{
			"shaderSource":vertexShaderSource,
			"shadertype":"vert"
		},
		{
			"shaderSource":fragmentShaderSource,
			"shadertype":"frag"
		}
	]
	var program =  webglUtils.createProgramFromScripts(gl, data);

	// look up where the vertex data needs to go.
	var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	// lookup uniforms
	var matrixLocation = gl.getUniformLocation(program, "u_matrix");

	// Create a buffer.
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


	 // Set Geometry.
	 setGeometry(gl);




	// code above this line is initialization code. 上面是初始化代码
	// code below this line is rendering code.下面是渲染代码

	webglUtils.resizeCanvasToDisplaySize(gl.canvas, 1);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	//gl.viewport(0, 0, 180, 320);

	// Clear the canvas 我感觉就是设置canvas颜色
	gl.clearColor(0, 0.1, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	var translation = [200, 150];
	var angleInRadians = 0;
	var scale = [1, 1];

	drawScene();

	 // Setup a ui.
	 webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
	 webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
	 webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
	 webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
	 webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
	 function updatePosition(index) {
		return function(event, ui) {
		  translation[index] = ui.value;
		  drawScene();
		};
	  }
	  function updatePosition(index) {
		return function(event, ui) {
		  translation[index] = ui.value;
		  drawScene();
		};
	  }
	
	  function updateAngle(event, ui) {
		var angleInDegrees = 360 - ui.value;
		angleInRadians = angleInDegrees * Math.PI / 180;
		drawScene();
	  }
	
	  function updateScale(index) {
		return function(event, ui) {
		  scale[index] = ui.value;
		  drawScene();
		};
	  }
	  function drawScene() {
		webglUtils.resizeCanvasToDisplaySize(gl.canvas);
	
		// Tell WebGL how to convert from clip space to pixels
		gl.viewport(0.1, 0, gl.canvas.width, gl.canvas.height);
	
		// Clear the canvas.
		gl.clear(gl.COLOR_BUFFER_BIT);
	
		// Tell it to use our program (pair of shaders)
		gl.useProgram(program);
	
		// Turn on the attribute
		gl.enableVertexAttribArray(positionAttributeLocation);
	
		// Bind the position buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 2;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.vertexAttribPointer(
			positionAttributeLocation, size, type, normalize, stride, offset);
	
		// Compute the matrix
		var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
		matrix = m3.translate(matrix, translation[0], translation[1]);
		matrix = m3.rotate(matrix, angleInRadians);
		matrix = m3.scale(matrix, scale[0], scale[1]);
	
		// Set the matrix.
		gl.uniformMatrix3fv(matrixLocation, false, matrix);
	
		// Draw the geometry.
		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 3;
		gl.drawArrays(primitiveType, offset, count);
	}
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
		x1 + 10, y2,
		x2, y1,
		x2, y2 + 20,
	]), gl.STATIC_DRAW);
}

// 定义一个三角形填充到缓冲里
function setGeometry(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			0, -100,
			150, 125,
			-175, 100
		]),
		gl.STATIC_DRAW);
}


  
main();