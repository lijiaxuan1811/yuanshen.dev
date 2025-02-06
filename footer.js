currentPath = window.location.pathname;
let hideTimeout;

// 显示子菜单
function showMenu() {
    clearTimeout(hideTimeout); // 清除隐藏的计时器
    const submenu = document.getElementById('submenu-container');
    submenu.style.display = 'block';
}

// 隐藏子菜单
function hideMenu() {
    hideTimeout = setTimeout(function () {
        const submenu = document.getElementById('submenu-container');
        submenu.style.display = 'none';
    }, 300); // 延迟 300 毫秒隐藏菜单
}

// 点击切换语言时候跳转到对应页面
function changeLang() {
    const parts = currentPath.split("/"); // 使用 / 分割字符串
    const lastPart = parts[parts.length - 1]; // 获取最后一段
    if (currentPath.includes("en")) {
        window.location.href = `https://www.yuanshen.dev/${lastPart}`;
    } else {
        window.location.href = `https://www.yuanshen.dev/en/${lastPart}`;
    }
}

//页面加载时调用这个方法
window.onload = function () {
    //随机选取一个背景图
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const bodyElement = document.getElementById("body");
    let backgroundURL;
    backgroundURL = `url('img/bg${getRandomInt(1, 11)}.webp') no-repeat center center fixed`;
    bodyElement.style.background = backgroundURL;
    bodyElement.style.backgroundSize = "cover";
    bodyElement.style.animation = "blurFadeIn 1s ease-out forwards";
    bodyElement.style.webkitAnimation = "blurFadeIn 1s ease-out forwards";
}