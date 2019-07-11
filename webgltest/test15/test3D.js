/* eslint no-console:0 consistent-return:0 */
"use strict";
//  WebGL 三维透视投影

function main() {
	// Get A WebGL context
	let data = Funs.initGl(shaders.vertexShaderSource, shaders.fragmentShaderSource)
	let gl = data.gl
	let program = data.program

	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");
	// lookup uniforms
	var matrixLocation = gl.getUniformLocation(program, "u_matrix");
	var colorLocation = gl.getAttribLocation(program, "a_color");


	// Create a buffer.
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	Funs.setGeometry3DF(gl);

	//剔除”背面三角形， "剔除"在这里是“不用绘制”的花哨叫法。
	gl.enable(gl.CULL_FACE);
	//开启深度缓冲
	gl.enable(gl.DEPTH_TEST);
	var colorBuffer = gl.createBuffer();
	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	// Put geometry data into buffer
	Funs.setColors3DF(gl);

	//定义一些变量存储矩形的平移，宽，高和颜色
	var translation = [45, 150, 0];
  	var rotation = [Funs.degToRad(40), Funs.degToRad(25), Funs.degToRad(325)];
  	var scaleArr = [1, 1, 1];
	var fudgeFactor = 1
	// Setup a ui.
	webglLessonsUI.setupSlider("#x", {
		value:translation[0],
		slide: updatePosition(0),
		max: gl.canvas.clientWidth
	});
	webglLessonsUI.setupSlider("#y", {
		value:translation[1],
		slide: updatePosition(1),
		max: gl.canvas.clientHeight
	});
	webglLessonsUI.setupSlider("#z", {
		value:translation[2],
		slide: updatePosition(2),
		max: gl.canvas.clientHeight,
		min:- gl.canvas.clientHeight,
		step:0.01,
		precision: 2
	});
	webglLessonsUI.setupSlider("#angleX", {
		value: Funs.radToDeg(rotation[0]),
		slide: updateRotation(0),
		max: 360
	});
	webglLessonsUI.setupSlider("#angleY", {
		value: Funs.radToDeg(rotation[1]),
		slide: updateRotation(1),
		max: 360
	});
	webglLessonsUI.setupSlider("#angleZ", {
		value: Funs.radToDeg(rotation[2]),
		slide: updateRotation(2),
		max: 360
	});
	webglLessonsUI.setupSlider("#scaleX", {
		value:scaleArr[0],
		slide: updateScale(0),
		min:-5,
		max: 5,
		step:0.01,
		precision: 2
	});

	webglLessonsUI.setupSlider("#scaleY", {
		value:scaleArr[1],
		slide: updateScale(1),
		min:-5,
		max: 5,
		step:0.01,
		precision: 2
	});
	webglLessonsUI.setupSlider("#scaleZ", {
		value:scaleArr[1],
		slide: updateScale(2),
		min:-5,
		max: 5,
		step:0.01,
		precision: 2
	});

	webglLessonsUI.setupSlider("#fudgeFactor", {
		value:fudgeFactor,
		slide: updateFudgeFactor(),
		min:-2,
		max: 2,
		step:0.001,
		precision: 2
	});
	function updateRotation(index) {
		return function (event, ui) {
			rotation[index] =  ui.value* Math.PI / 180;
			drawScene();
		};
	}
	function updatePosition(index) {
		return function (event, ui) {
			translation[index] = ui.value;
			drawScene();
		};
	}
	function updateScale(index) {
		return function (event, ui) {
			scaleArr[index] = ui.value;
			drawScene();
		};
	}

	function updateFudgeFactor() {
		return function (event, ui) {
			fudgeFactor = ui.value;
			drawScene();
		};
	}
	drawScene();

	// 绘制场景
	function drawScene() {
		webglUtils.resizeCanvasToDisplaySize(gl.canvas);
		// 告诉WebGL如何从裁剪空间对应到像素
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		// 清空画布和深度缓冲
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		// 使用我们的程序
		gl.useProgram(program);
	

	
		// Turn on the color attribute
		gl.enableVertexAttribArray(colorLocation);

		// Bind the color buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

		// 告诉颜色属性怎么从 colorBuffer (ARRAY_BUFFER) 中读取颜色值
		var size = 3; // 每次迭代使用 3 个单位的数据
		var type = gl.UNSIGNED_BYTE; // 单位数据类型是无符号 8 位整数
		var normalize = true; // 标准化数据 (从 0-255 转换到 0.0-1.0)
		var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
		var offset = 0; // 从缓冲起始位置开始读取
		gl.vertexAttribPointer(
			colorLocation, size,  type, normalize, stride, offset)
			
		// 启用属性
		gl.enableVertexAttribArray(positionLocation);
		// 绑定位置缓冲
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


		// 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
		var size = 3; // 每次迭代使用 3 个单位的数据
		var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
		var normalize = false; // 不需要归一化数据
		var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
		var offset = 0; // 从缓冲起始位置开始读取

		gl.vertexAttribPointer(
			positionLocation, size,  type, normalize, stride, offset)


		var matrix = Funs.makeZToWMatrix(fudgeFactor);
		// // 计算矩阵,将坐标
		let matrix2 = m4.projection(
			gl.canvas.clientWidth, gl.canvas.clientHeight,400);
		matrix= m4.multiply(matrix,matrix2)
		matrix= m4.translate(matrix,translation[0],translation[1],translation[2])
		matrix= m4.xRotate(matrix,rotation[0])
		matrix= m4.yRotate(matrix,rotation[1])
		matrix= m4.zRotate(matrix,rotation[2])
		matrix= m4.scale(matrix,scaleArr[0],scaleArr[1],scaleArr[2])

		gl.uniformMatrix4fv(matrixLocation, false, matrix);

		// Draw the geometry.
		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 16*6;  // 6 triangles in the 'F', 3 points per triangle
		gl.drawArrays(primitiveType, offset, count);

	}
}

main();