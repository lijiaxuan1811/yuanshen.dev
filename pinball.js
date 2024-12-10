// 获取当前页面路径
const currentPath = window.location.pathname;
let scoreName, gameOverMsg;
// 根据页面语言动态加载不同的字符串
if (currentPath.includes("en")) {
    scoreName = "Score: ";
    gameOverMsg = "Oh no! Game over!";
} else {
    scoreName = "分数：";
    gameOverMsg = "完喽，寄了!";
}
let canv = document.getElementById("canvas");
let ctx = canv.getContext("2d"); //创建画布和画笔对象
let easy = document.getElementById("easy");
let hard = document.getElementById("hard");
let insane = document.getElementById("insane"); //创建三个复选框对象
//声明一些杂七杂八的变量
let startX = 0;
let startY = 0;
let panelX = 0;
let flag = false;
let score = 0;
let intervalTime = 30;
let mainInterval;
let leftInterval;
let rightInterval;
let waitTime;

//var testI = 0;
function debounce(func, wait, imme) {
    //防止键盘按下某个按键之后连续114.5(x)次的重复情况
    //参数func是传入的需要通过按键执行的方法，wait是如果连续执行则每次执行的间隔时间（毫秒）
    //布尔类型参数imme如果被设置为“true”则取消等待时间（那你为啥还要用这个方法x）
    //参（chao）考（de）以下帖子中的代码，作者为Peter Mortensen
    //https://www.stackoverflow.com/questions/24004791/what-is-the-debounce-function-in-javascript/24004942#24004942
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var callNow = imme && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!imme) {
                func.apply(context, args);
            }
        }, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

function clickCheckbox(checkbox) {
    if (checkbox.checked) {
        easy.checked = false;
        hard.checked = false;
        insane.checked = false;
        checkbox.checked = true;
    }
    //防止同时选择多个复选框
}

function readCheckbox() {
    if (easy.checked) {
        return [30, 20];
    } else if (hard.checked) {
        return [20, 10];
    } else if (insane.checked) {
        return [10, 5];
    } else {
        return [30, 20];
    }
    //判断选中了哪个复选框，返回对应的间隔时间
}

function prep() {
    //随机生成弹球和挡板的初始位置坐标
    //只有生成的数在某一个范围内才跳出死循环（看起来很危险的样子，不过实际上几乎不会超过几毫秒x）
    //确实有用数学运算的优化方法，但是实在不（lan）想（de）改代码了
    //10 px<startX<390 px: 避免球卡进左右边框
    //10 px<startY<380 px: 避免球卡进上下边框或者一开局就gg（当然还是有可能的）
    //0 px<panelX<350 px: 避免挡板卡进左右边框
    while (true) {
        startX = Math.floor(Math.random() * 1000);
        if (startX > 10 && startX < 390) {
            break;
        }
    }
    while (true) {
        startY = Math.floor(Math.random() * 1000);
        if (startY > 10 && startY < 380) {
            break;
        }
    }
    while (true) {
        panelX = Math.floor(Math.random() * 1000);
        if (panelX > 0 && panelX < 350) {
            break;
        }
    }
}

var ball = {
    //声明弹球的基本属性
    //包括初始坐标，下一步的移动速度和一些方法
    x: startX,
    y: startY,
    //移动速度，正负分别代表不同方向
    xSpeed: -2,
    ySpeed: -2,
    draw: function () {
        ctx.fillStyle = "Red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, false); //在画布上画出弹球
        ctx.fill();
    },
    move: function (panelSt, panelEn) {
        if (this.x + this.xSpeed < 10 || this.x + this.xSpeed > 390) {
            this.xSpeed = -this.xSpeed; //碰左右壁，反弹
        } else {
            this.x += this.xSpeed; //继续移动
        }
        if (this.y + this.ySpeed < 10 || this.y + this.ySpeed > 390) {
            this.ySpeed = -this.ySpeed; //碰顶，反弹
        } else if (this.y + this.ySpeed >= 380 && this.y + this.ySpeed <= 390) {
            //碰底，检测是否被接住了
            if (this.x > panelSt - 10 && this.x < panelEn + 10) {
                this.ySpeed = -this.ySpeed;
                score += 5;
                //接住了，弹起并且加五分
            } else {
                //this.y += this.ySpeed;
                window.alert(gameOverMsg);
                //this.x = 0;
                //this.y = 0;
                score = 0;
                flag = true;
                //没接住，积分清零并且初始化一些东西
            }
        } else {
            this.y += this.ySpeed; //Continue moving
        }
    },
};
var panel = {
    //声明挡板的基本属性
    //比如位置还有键盘控制的方法
    x: panelX,
    y: 390,
    xSize: 50,
    ySize: 5,
    draw: function () {
        ctx.fillStyle = "Black";
        ctx.fillRect(this.x, this.y, this.xSize, this.ySize); //Draw the panel
    },
};

function keyPanel(event) {
    if (event.keyCode === 65 || event.keyCode === 37) {
        //‘a’被按下了，向左移动
        //console.log("Left!",testI);
        //testI++;
        panel.x -= 8;
        if (panel.x < 0) {
            panel.x = 0; //再移动就出左边界喽，所以移动到左边界就好
        }
    }
    if (event.keyCode === 68 || event.keyCode === 39) {
        //‘d’被按下了，向右移动
        //console.log("Right!",testI);
        //testI++;
        panel.x += 8;
        if (panel.x > 400 - panel.xSize) {
            panel.x = 400 - panel.xSize; //再移动就出右边界喽，所以移动到右边界就好
            //注意哦，挡板的定位点在左上角诶
        }
    }
}

//调用debounce函数
var dbPanelKey = debounce(keyPanel, waitTime);

function leftClick() {
    panel.x -= 15;
    if (panel.x < 0) {
        panel.x = 0;
    }
    //如果向左按钮按下了就向左移动（一开始先执行一次以防按下小于100毫秒）
    leftInterval = setInterval(function () {
        panel.x -= 15;
        if (panel.x < 0) {
            panel.x = 0;
        }
    }, 100);
    //长按就每100毫秒重复一次
}

function rightClick() {
    panel.x += 15;
    if (panel.x > 400 - panel.xSize) {
        panel.x = 400 - panel.xSize;
    }
    rightInterval = setInterval(function () {
        panel.x += 15;
        if (panel.x > 400 - panel.xSize) {
            panel.x = 400 - panel.xSize;
        }
    }, 100);
    //同理，向右移动并重复
}

const leftButton = document.getElementById("leftButton"); //创建向左按钮对象
leftButton.addEventListener("mousedown", leftClick); //如果鼠标按下那么执行方法移动挡板
leftButton.addEventListener("mouseup", function () {
    clearInterval(leftInterval);
}); //如果鼠标松开那么停止计时器防止鬼畜（
const rightButton = document.getElementById("rightButton"); //向右按钮同理
rightButton.addEventListener("mousedown", rightClick);
rightButton.addEventListener("mouseup", function () {
    clearInterval(rightInterval);
});
window.addEventListener("keydown", dbPanelKey); //检测是否有键盘按键按下
//每隔特定时间刷新一次弹球位置（更改这个时间就可以显著改变游戏难度哦~）
function start() {
    //点击开始按钮之后就会来到这里～
    clearInterval(mainInterval);
    score = 0;
    prep();
    ball.x = startX;
    ball.y = startY;
    panel.x = panelX;
    clearInterval(leftInterval);
    clearInterval(rightInterval);
    let checkboxResult = readCheckbox(); //这个画布更新时间和挡板移动间隔是根据难度决定的哦～（EZ=30ms, 20ms; HD=20ms, 10ms; IN=10ms, 5ms; 不选=30ms, 20ms）
    intervalTime = checkboxResult[0];
    waitTime = checkboxResult[1];
    mainInterval = setInterval(function () {
        if (flag === true) {
            //上一次寄了，所以重新生成小球和挡板的位置（也许可以但不能百分百避免游戏寄掉的死循环）
            prep();
            ball.x = startX;
            ball.y = startY;
            panel.x = panelX;
            flag = false;
            clearInterval(leftInterval);
            clearInterval(rightInterval); //如果寄了就重置定时器，防止重开之后挡板不受控移动
        } else {
            ctx.clearRect(0, 0, 400, 400); //清除画布，不要留下轨迹
            ctx.font = "20px GenshinImpactZhLv1"; //选择积分显示字体
            ctx.fillText(scoreName + score, 10, 30); //在画布上显示最新积分
            ball.draw(); //调用方法绘制弹球
            panel.draw(); //调用方法绘制挡板
            ball.move(panel.x, panel.x + panel.xSize); //移动弹球，同时传入挡板最新位置，进行碰撞检测
            ctx.strokeRect(0, 0, 400, 400); //用黑线标记画布边界hanges.
        }
    }, intervalTime);
}
