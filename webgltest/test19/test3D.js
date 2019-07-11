/* eslint no-console:0 consistent-return:0 */
"use strict";
//  WebGL WebGL 三维相机
//我们可以同时定义相机位置和朝向，然后矩阵就可以将相机放在那，
// 基于矩阵这个工作就会变得非常简单。

//未完成
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
	var numElements =setGeometryHead(gl);

	
	var colorBuffer = gl.createBuffer();
	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	// Put geometry data into buffer
	Funs.setColors3DF(gl);

	
	//定义一些变量存储矩形的平移，宽，高和颜色
	var target = [0, 200, 300];
	var targetAngleRadians = 0;
	var targetRadius = 300;
	var fieldOfViewRadians = Funs.degToRad(60);
  
	webglLessonsUI.setupSlider("#targetAngle", {
		value:Funs.radToDeg(targetAngleRadians),
		slide: updateTargetAngle,
		min:-360,
		max: 360,
	});

	webglLessonsUI.setupSlider("#targetHeight", {
		value:target[1],
		slide: setupTargetHeight,
		min:50,
		max: 300,
		step:1,
		precision: 2
	});





	function updateTargetAngle (event, ui) {
		targetAngleRadians = Funs.degToRad(ui.value);
		target[0] = Math.sin(targetAngleRadians) * targetRadius;
		target[2] = Math.cos(targetAngleRadians) * targetRadius;
		drawScene();
	}
	function setupTargetHeight(event ,ui) {
		target[1] =ui.value;
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
		var zNear = 1;
		var zFar = 3000;
		var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

		var cameraTarget = [0, -100, 0];
		var cameraPosition = [500, 300, 500];
		var up = [0, 1, 0];

		// 计算相机的朝向矩阵
		var cameraMatrix = m4.lookAt(cameraPosition, cameraTarget, up);

		// 通过相机矩阵获得视图矩阵
		var viewMatrix = m4.inverse(cameraMatrix);

		// Compute a view projection matrix
		var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

		let tt1 = m4.translation(target[0], target[1], target[2])

		drawHead(gl,matrixLocation,tt1,viewProjectionMatrix,numElements)
	
	}
}

function drawHead(gl,matrixLocation,matrix, viewProjectionMatrix, numElements) {
    // multiply that with the viewProjecitonMatrix
    matrix = m4.multiply(viewProjectionMatrix, matrix);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    gl.drawArrays(gl.TRIANGLES, 0, numElements);
};

function setGeometryHead(gl){
	var positions = new Float32Array(HeadData.positions);
	var matrix = m4.multiply(m4.scaling(6, 6, 6), m4.yRotation(Math.PI));
	for (var ii = 0; ii < positions.length; ii += 3) {
	  var vector = m4.vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
	  positions[ii + 0] = vector[0];
	  positions[ii + 1] = vector[1];
	  positions[ii + 2] = vector[2];
	}
  
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	return positions.length / 3;
}

main();