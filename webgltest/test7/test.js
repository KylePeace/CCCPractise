/* eslint no-console:0 consistent-return:0 */
"use strict";

function render(image) {
	// Get A WebGL context
	let data = Funs.initGl(shaders.vertexShaderSource, shaders.fragmentShaderSource)
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

	//  创建一个纹理并写入图像
	var originalImageTexture = Funs.createAndSetupTexture(gl, image);

	// 创建两个纹理绑定到帧缓冲
	var textures = []
	var framebuffers = []
	for (let ii = 0; ii < 2; ii++) {
		let texture = Funs.createAndSetupTexture(gl,image,true)
		textures.push(texture)
		//创建一个帧缓冲
		var fbo = gl.createFramebuffer()
		framebuffers.push(fbo)
		//调用 gl.bindFramebuffer 设置为 null是告诉WebGL 你想在画布上绘制，而不是在帧缓冲上。
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)

		//绑定纹理到帧缓冲
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
	}



	// lookup uniforms
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
	var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
	var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
	var flipYLocation = gl.getUniformLocation(program, "u_flipY");


	var effects = [{
			name: "gaussianBlur3",
			on: true
		},
		{
			name: "gaussianBlur3",
			on: true
		},
		{
			name: "gaussianBlur3",
			on: true
		},
		{
			name: "sharpness",
		},
		{
			name: "sharpness",
		},
		{
			name: "sharpness",
		},
		{
			name: "sharpen",
		},
		{
			name: "sharpen",
		},
		{
			name: "sharpen",
		},
		{
			name: "unsharpen",
		},
		{
			name: "unsharpen",
		},
		{
			name: "unsharpen",
		},
		{
			name: "emboss",
			on: true
		},
		{
			name: "edgeDetect",
		},
		{
			name: "edgeDetect",
		},
		{
			name: "edgeDetect3",
		},
		{
			name: "edgeDetect3",
		},
	];

	// 设置UI
	var ui = document.getElementById("ui");
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	for (var ii = 0; ii < effects.length; ++ii) {
		var effect = effects[ii];
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		var chk = document.createElement("input");
		chk.value = effect.name;
		chk.type = "checkbox";
		if (effect.on) {
			chk.checked = "true";
		}
		chk.onchange = drawEffects;
		td.appendChild(chk);
		td.appendChild(document.createTextNode('≡ ' + effect.name));
		tr.appendChild(td);
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	ui.appendChild(table);
	$("#ui table").tableDnD({
		onDrop: drawEffects
	});


	function computeKernelWeight(kernel) {
		var weight = kernel.reduce(function (prev, curr) {
			return prev + curr;
		});
		return weight <= 0 ? 1 : weight;
	}

	drawEffects();

	function computeKernelWeight(kernel) {
		var weight = kernel.reduce(function (prev, curr) {
			return prev + curr;
		});
		return weight <= 0 ? 1 : weight;
	}

	function drawEffects(name) {
		webglUtils.resizeCanvasToDisplaySize(gl.canvas);

		// Clear the canvas
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Tell it to use our program (pair of shaders)
		gl.useProgram(program);

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
		gl.vertexAttribPointer(
			positionLocation, size, type, normalize, stride, offset);

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

		// set the size of the image
		gl.uniform2f(textureSizeLocation, image.width, image.height);

		// 从原始图像开始
		gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

		// 在渲染效果时不翻转y轴
		gl.uniform1f(flipYLocation, 1);

		// 循环施加每一种渲染效果.
		var count = 0;
		for (var ii = 0; ii < tbody.rows.length; ++ii) {
			var checkbox = tbody.rows[ii].firstChild.firstChild;
			if (checkbox.checked) {
				// 使用两个帧缓冲中的一个
				setFramebuffer(framebuffers[count % 2], image.width, image.height);

				drawWithKernel(checkbox.value);

				// 下次绘制时使用刚才的渲染结果
				gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);

				// increment count so we use the other texture next time.
				++count;
			}
		}

		 // 最后将结果绘制到画布
		gl.uniform1f(flipYLocation, -1); // 需要绕y轴翻转
		setFramebuffer(null, gl.canvas.width, gl.canvas.height);
		drawWithKernel("normal");
	}

	function setFramebuffer(fbo, width, height) {
		//  设定当前使用帧缓冲
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

		 // 告诉着色器分辨率是多少.
		gl.uniform2f(resolutionLocation, width, height);

		// 告诉WebGL帧缓冲需要的视图大小
		gl.viewport(0, 0, width, height);
	}




	function drawWithKernel(name) {
		 // 设置卷积核
		gl.uniform1fv(kernelLocation, kernels[name]);
		gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

		// 画出矩形
		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 6;
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

// Define several convolution kernels
var kernels = {
	normal: [
		0, 0, 0,
		0, 1, 0,
		0, 0, 0
	],
	gaussianBlur: [
		0.045, 0.122, 0.045,
		0.122, 0.332, 0.122,
		0.045, 0.122, 0.045
	],
	gaussianBlur2: [
		1, 2, 1,
		2, 4, 2,
		1, 2, 1
	],
	gaussianBlur3: [
		0, 1, 0,
		1, 1, 1,
		0, 1, 0
	],
	unsharpen: [
		-1, -1, -1,
		-1, 9, -1,
		-1, -1, -1
	],
	sharpness: [
		0, -1, 0,
		-1, 5, -1,
		0, -1, 0
	],
	sharpen: [
		-1, -1, -1,
		-1, 16, -1,
		-1, -1, -1
	],
	edgeDetect: [
		-0.125, -0.125, -0.125,
		-0.125, 1, -0.125,
		-0.125, -0.125, -0.125
	],
	edgeDetect2: [
		-1, -1, -1,
		-1, 8, -1,
		-1, -1, -1
	],
	edgeDetect3: [
		-5, 0, 0,
		0, 0, 0,
		0, 0, 5
	],
	edgeDetect4: [
		-1, -1, -1,
		0, 0, 0,
		1, 1, 1
	],
	edgeDetect5: [
		-1, -1, -1,
		2, 2, 2,
		-1, -1, -1
	],
	edgeDetect6: [
		-5, -5, -5,
		-5, 39, -5,
		-5, -5, -5
	],
	sobelHorizontal: [
		1, 2, 1,
		0, 0, 0,
		-1, -2, -1
	],
	sobelVertical: [
		1, 0, -1,
		2, 0, -2,
		1, 0, -1
	],
	previtHorizontal: [
		1, 1, 1,
		0, 0, 0,
		-1, -1, -1
	],
	previtVertical: [
		1, 0, -1,
		1, 0, -1,
		1, 0, -1
	],
	boxBlur: [
		0.111, 0.111, 0.111,
		0.111, 0.111, 0.111,
		0.111, 0.111, 0.111
	],
	triangleBlur: [
		0.0625, 0.125, 0.0625,
		0.125, 0.25, 0.125,
		0.0625, 0.125, 0.0625
	],
	emboss: [
		-2, -1, 0,
		-1, 1, 1,
		0, 1, 2
	]
};


main();