// 获取当前页面路径
const currentImgPath = window.location.pathname;

// 动态加载不同的图片文件路径
function getImgPath() {
    if (currentImgPath.includes("en")) {
        return "..";
    }else {
        return ".";
    }
}

function getUserAgent() {
    //获取浏览器User Agent，在前面的分隔符标签中显示
    document.getElementById("userAgentDisplay").innerHTML = navigator.userAgent;
}

//页面加载时调用这个方法
window.onload = function () {
    //随机选取一个背景图
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const bodyElement = document.getElementById("body");
    let backgroundURL = `url('${getImgPath()}/img/bg${getRandomInt(1, 11)}.webp') no-repeat center center fixed`;
    bodyElement.style.background = backgroundURL;
    bodyElement.style.backgroundSize = "cover";
    bodyElement.style.animation = "blurFadeIn 1s ease-out forwards";
    bodyElement.style.webkitAnimation = "blurFadeIn 1s ease-out forwards";
    //获取User Agent
    getUserAgent();
}