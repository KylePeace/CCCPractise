/* eslint no-console:0 consistent-return:0 */
"use strict";
//  二维  矩阵变化

function main() {
	// Get A WebGL context
	let data = Funs.initGl(shaders.vertexShaderSource, shaders.fragmentShaderSource)
	let gl = data.gl
	let program = data.program

	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");
	// lookup uniforms
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

	var matrixLocation = gl.getUniformLocation(program, "u_matrix");



	var colorLocation = gl.getUniformLocation(program, "u_color");

	// Create a buffer.
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	//定义一些变量存储矩形的平移，宽，高和颜色
	var translation = [0, 0];
	var angleInRadians = 0;
	let scaleArr = [1.0,1.0]
	var color = [Math.random(), Math.random(), Math.random(), 1];

	// Setup a ui.
	webglLessonsUI.setupSlider("#x", {
		slide: updatePosition(0),
		max: gl.canvas.width
	});
	webglLessonsUI.setupSlider("#y", {
		slide: updatePosition(1),
		max: gl.canvas.height
	});
	webglLessonsUI.setupSlider("#angle", {
		slide: updateAngle(),
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


	  function updateAngle() {
		return function (event, ui) {
			angleInRadians =  ui.value* Math.PI / 180;;
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
	drawScene();

	// 绘制场景
	function drawScene() {
		webglUtils.resizeCanvasToDisplaySize(gl.canvas);
		// 告诉WebGL如何从裁剪空间对应到像素
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		// 清空画布
		gl.clear(gl.COLOR_BUFFER_BIT);
		// 使用我们的程序
		gl.useProgram(program);
		// 启用属性
		gl.enableVertexAttribArray(positionLocation);
		// 绑定位置缓冲
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		var translationMatrix = m3.translation(translation[0], translation[1]);
		var rotationMatrix = m3.rotation(angleInRadians);
		var scaleMatrix = m3.scaling(scaleArr[0], scaleArr[1]);
		
		// 矩阵相乘
		// var matrix = m3.multiply(translationMatrix, rotationMatrix);
		// matrix = m3.multiply(matrix, translationMatrix);

		var matrix = m3.multiply(scaleMatrix, rotationMatrix);
		matrix = m3.multiply(matrix, translationMatrix);

		// 设置矩阵
		gl.uniformMatrix3fv(matrixLocation,false,matrix); 

		// 设置矩形参数
		Funs.setGeometryF(gl);

		// 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
		var size = 2; // 每次迭代运行提取两个单位数据
		var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
		var normalize = false; // 不需要归一化数据
		var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
		var offset = 0; // 从缓冲起始位置开始读取

		gl.vertexAttribPointer(
			positionLocation, size, type, normalize, stride, offset)
		
			
		// 设置分辨率
		gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

		let R = ((translation[0]+translation[1])%255)/255
		let G = ((translation[0])%255)/255
		let B =((translation[1])%255)/255
		// 设置颜色
		gl.uniform4fv(colorLocation,  [R, G, B, 1]);

		// 绘制F
		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 18;
		gl.drawArrays(primitiveType, offset, count);

	}
}

main();