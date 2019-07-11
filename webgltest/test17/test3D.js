/* eslint no-console:0 consistent-return:0 */
"use strict";
//  WebGL WebGL 三维相机

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
	Funs.setGeometry3DF2(gl);

	
	var colorBuffer = gl.createBuffer();
	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	// Put geometry data into buffer
	Funs.setColors3DF(gl);

	
	//定义一些变量存储矩形的平移，宽，高和颜色
	var cameraAngleRadians = Funs.degToRad(0);
	var fieldOfViewRadians = Funs.degToRad(60);
	let zNear =  1
	let zFar  =  2000 
	webglLessonsUI.setupSlider("#cameraAngle", {
		value:Funs.radToDeg(cameraAngleRadians),
		slide: updateCameraAngle,
		min:-360,
		max: 360,
	});

	webglLessonsUI.setupSlider("#zNear", {
		value:zNear,
		slide: updateZNear,
		min:1,
		max: 2000,
		step:1,
		precision: 2
	});

	webglLessonsUI.setupSlider("#zFar", {
		value:zFar,
		slide: updateZFar,
		min:10,
		max: 2000,
		step:1,
		precision: 2
	});



	function updateCameraAngle (event, ui) {
		cameraAngleRadians =Funs.degToRad(ui.value);
		drawScene();
	}
	function updateZNear(event ,ui) {
		zNear =ui.value;
		drawScene();
	}
	function updateZFar(event ,ui) {
		zFar = ui.value;
		drawScene();
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
	
		//剔除”背面三角形， "剔除"在这里是“不用绘制”的花哨叫法。
		gl.enable(gl.CULL_FACE);
		//开启深度缓冲
		gl.enable(gl.DEPTH_TEST);
	
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


		
		// 计算投影矩阵
		var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		// var zNear = 1;
		// var zFar = 2000;
		var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

		var numFs = 5;
		var radius = 200;
		// 计算相机的矩阵
		var cameraMatrix = m4.yRotation(cameraAngleRadians);
		cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);
		// Make a view matrix from the camera matrix
		var viewMatrix = m4.inverse(cameraMatrix);

		// Compute a view projection matrix
		var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

		for (let ii = 0; ii < numFs; ii++) {
			var angle = ii * Math.PI * 2 / numFs;
			var x = Math.cos(angle) * radius;
			var y = Math.sin(angle) * radius;

			  // 从视图投影矩阵开始
  				// 计算 F 的矩阵	
			var matrix = m4.translate(viewProjectionMatrix, x, 0, y);

			// 设置矩阵
			gl.uniformMatrix4fv(matrixLocation, false, matrix);

			 // 获得几何体
			var primitiveType = gl.TRIANGLES;
			var offset = 0;
			var count = 16 * 6;
			gl.drawArrays(primitiveType, offset, count);
		}
	}
}

main();