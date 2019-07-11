/* eslint no-console:0 consistent-return:0 */
"use strict";
//  WebGL WebGL 三维相机
//我们可以同时定义相机位置和朝向，然后矩阵就可以将相机放在那，
// 基于矩阵这个工作就会变得非常简单。

function main() {
	// Get A WebGL context
	let data = Funs.initGl(shaders.vertexShaderSource, shaders.fragmentShaderSource)
	let gl = data.gl
	let program = data.program

	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");
	// lookup uniforms
	      // 寻找全局变量
	var worldViewProjectionLocation =gl.getUniformLocation(program, "u_worldViewProjection");
    var worldInverseTransposeLocation  = gl.getUniformLocation(program, "u_worldInverseTranspose");
	var normalLocation = gl.getAttribLocation(program, "a_normal");
	// 寻找全局变量
	var colorLocation = gl.getUniformLocation(program, "u_color");
	var reverseLightDirectionLocation =
		gl.getUniformLocation(program, "u_reverseLightDirection");

	// 创建缓冲存储法向量
	var normalBuffer = gl.createBuffer();
	// 绑定到 ARRAY_BUFFER (可以看作 ARRAY_BUFFER = normalBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	// 将法向量存入缓冲
	Funs.setNormals(gl);

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
	var fRotationRadians = Funs.degToRad(0);
	var fieldOfViewRadians = Funs.degToRad(60);

	webglLessonsUI.setupSlider("#fRotation", {
		value: Funs.radToDeg(fieldOfViewRadians),
		slide: updateCameraAngle,
		min: -360,
		max: 360,
	});





	function updateCameraAngle(event, ui) {
		fRotationRadians = Funs.degToRad(ui.value);
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


		//剔除”背面三角形， "剔除"在这里是“不用绘制”的花哨叫法。
		gl.enable(gl.CULL_FACE);
		//开启深度缓冲
		gl.enable(gl.DEPTH_TEST);

		// 使用我们的程序
		gl.useProgram(program);

		// 启用法向量属性
		gl.enableVertexAttribArray(normalLocation);

		// 绑定法向量缓冲
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

		// 告诉法向量属性怎么从 normalBuffer (ARRAY_BUFFER) 中读取值
		var size = 3; // 每次迭代使用3个单位的数据
		var type = gl.FLOAT; // 单位数据类型是 32 位浮点型
		var normalize = false; // 单位化 (从 0-255 转换到 0-1)
		var stride = 0; // 0 = 移动距离 * 单位距离长度sizeof(type)  每次迭代跳多少距离到下一个数据
		var offset = 0; // 从绑定缓冲的起始处开始
		gl.vertexAttribPointer(
			normalLocation, size, type, normalize, stride, offset)


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
			positionLocation, size, type, normalize, stride, offset)

	
		// 计算投影矩阵
		var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		var zNear = 1;
		var zFar = 2000;
		var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

		// Compute the camera's matrix
		var camera = [100, 150, 200];
		var target = [0, 35, 0];
		var up = [0, 1, 0];
		var cameraMatrix = m4.lookAt(camera, target, up);

		// Make a view matrix from the camera matrix.
		var viewMatrix = m4.inverse(cameraMatrix);

		// Compute a view projection matrix
		var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

		// Draw a F at the origin
		var worldMatrix = m4.yRotation(fRotationRadians);

		// Multiply the matrices.
		var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);

		var worldInverseMatrix = m4.inverse(worldMatrix);
		var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

		// Set the matrices
		gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
		gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);

		// Set the color to use
		gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green

		// set the light direction.
		gl.uniform3fv(reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]));

		// Draw the geometry.
		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 16 * 6;
		gl.drawArrays(primitiveType, offset, count);

	}
}

main();