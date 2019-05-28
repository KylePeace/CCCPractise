      // 定义一些卷积核
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
    unsharpen: [
        -1, -1, -1,
        -1, 9, -1,
        -1, -1, -1
    ],
    emboss: [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2
    ]
};

// 将要使用的效果列表
window.effectsToApply = [
    "gaussianBlur",
    "emboss",
    "gaussianBlur",
    "unsharpen"
];