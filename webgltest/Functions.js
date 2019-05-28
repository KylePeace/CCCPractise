//webgl通用函数

window.Funs = {

}
// 创建纹理
Funs.createAndSetupTexture = function (gl, image, is) {
    // 创建纹理
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置材质，这样我们可以对任意大小的图像进行像素操作
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // 设置纹理大小和图像大小一致
    if (!is) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    return texture;
}

//初始化gl
Funs.initGl = function (vert, frag) {
    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // 查找顶点数据所需的位置。
    let data = [{
            "shaderSource": vert,
            "shadertype": "vert"
        },
        {
            "shaderSource": frag,
            "shadertype": "frag"
        }
    ]
    var program = webglUtils.createProgramFromScripts(gl, data);
    return {
        "gl": gl,
        "program": program
    }
}

//随机值
Funs.randomInt = function (range) {
    return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
Funs.setRectangle = function (gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
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



// 在缓冲存储构成 'F' 的值
Funs.setGeometryF= function(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // 左竖
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            // 上横
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            // 中横
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW);
}