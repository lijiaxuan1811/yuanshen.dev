var canv = document.getElementById("canvas"); //声明画布对象
var ctx = canv.getContext("2d"); //声明画笔对象
var img1 = new Image();
var img2 = new Image(); //声明中国铁路logo和二维码的图片对象
img1.src = "./img1.gif";
img2.src = "./img2.gif";
var date1, time1, date2, time2, trainTypeDrop, trainNo; //声明表单中若干项目的对象变量
var button = document.getElementById("submit1"); //声明提交按钮对象
var depTime = "",
  depYear = "",
  depStation = "",
  depPy = "",
  arrStation = "",
  arrPy = "",
  prtDate = "",
  prtTime = "",
  trainNumber = "",
  machineType = "",
  machineNo = "",
  code1 = "",
  seatNumber = "",
  seatType = "",
  fare = "",
  ticketCheck = "",
  orderNo = "",
  ticketNo = "",
  name = "",
  idTypeEng = "",
  idTypeChn = "",
  idNo = "",
  TMIS = ""; //声明所有字符串变量
var depMonth = 0,
  depDay = 0,
  pointer = 0,
  pointer1 = 0,
  temp = 0,
  temp1 = "",
  temp2 = 0,
  temp3 = 0; //声明数字、临时变量

function readForm() {
  //本函数从输入表单中读取所有输入的数据
  date1 = document.getElementById("date1");
  time1 = document.getElementById("time1");
  date2 = document.getElementById("date2");
  time2 = document.getElementById("time2"); //日期时间选框
  trainTypeDrop = document.getElementById("trainTypeDrop"); //车次类型下拉框对象
  trainNo = document.getElementById("trainNo");
  temp1 = trainTypeDrop.options[trainTypeDrop.selectedIndex].value; //获取下拉框所有选择项中被选中项的值
  if (temp1 == "normal") {
    trainNumber = trainNo.value; //如果类型为普客，则不加任何前缀
  } else {
    trainNumber = temp1 + trainNo.value; //否则，使用该项的值作为车次号前缀
  }
  depTime = time1.value;
  depYear = date1.value.substr(0, 4); //分别截取开车年月日
  depMonth = Number(date1.value.substr(5, 2));
  depDay = Number(date1.value.substr(8, 2)); //将开车月日转换为数字类型，避免一位数前导0
  prtDate = date2.value;
  prtTime = time2.value; //出票日期时间格式可直接使用，无需转换
  depStation = document.getElementById("depStation").value;
  depPy = document.getElementById("depPy").value;
  arrStation = document.getElementById("arrStation").value;
  arrPy = document.getElementById("arrPy").value;
  seatNumber = document.getElementById("seatNumber").value;
  seatType = document.getElementById("seatType").value;
  fare = document.getElementById("fare").value;
  ticketCheck = document.getElementById("ticketCheck").value;
  TMIS = document.getElementById("TMIS").value;
  machineType = document.getElementById("machineType").value;
  machineNo = document.getElementById("machineNo").value;
  orderNo = document.getElementById("orderNo").value;
  ticketNo = document.getElementById("ticketNo").value;
  name = document.getElementById("name").value;
  idTypeEng = document.getElementById("idTypeEng").value;
  idTypeChn = document.getElementById("idTypeChn").value;
  idNo = document.getElementById("idNo").value; //获取输入框的输入值（直接使用document.getElementById方法，减少需要声明的对象数量）
}

function init() {
  //触发按钮或者键盘事件之后，首先调用本函数，读取输入值并填充固定内容
  readForm(); //调用函数读取表单
  ctx.clearRect(0, 0, canv.width, canv.height); //清除画布上的所有元素
  //设置画布底色白色
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canv.width, canv.height); //填充画布底色
  //设置文字颜色黑色
  ctx.fillStyle = "#000000";
  pointer = 0;
  pointer1 = 0; //清空文字x坐标指针
  ctx.drawImage(img1, 50, 90, 45, 45); //填充中国铁路logo
  ctx.drawImage(img2, 470, 850, 300, 300); //填充二维码
  ctx.font = "35px 黑体";
  ctx.fillText("中国铁路", 100, 130);
  ctx.font = "Bold 30px Times New Roman";
  ctx.fillText("China Railway", 250, 130);
  ctx.font = "50px 宋体";
  ctx.fillText("行程信息提示", 260, 195);
  ctx.font = "37px Times New Roman";
  ctx.fillText("Trip Information Reminders", 190, 240);
  ctx.setLineDash([15, 3]); //设置直线类型为虚线，每段15像素，间隔3像素
  ctx.lineDashOffset = -0; //设置虚线起始端偏移为0像素
  ctx.beginPath(); //开始绘制虚线
  ctx.moveTo(40, 260); //设置起点为(40,260)
  ctx.lineTo(775, 260); //设置终点为(775,260)
  ctx.stroke(); //绘制第一条虚线
  ctx.moveTo(40, 800); //设置起点为(40,800)
  ctx.lineTo(775, 800); //设置终点为(775,800)
  ctx.stroke(); //绘制第二条虚线
  ctx.moveTo(40, 1200); //设置起点为(40,1200)
  ctx.lineTo(775, 1200); //设置终点为(775,1200)
  ctx.stroke(); //绘制第三条虚线
  ctx.closePath(); //结束绘制虚线
  ctx.font = "30px 宋体";
  ctx.fillText("限乘当日当次车", 40, 570);
  ctx.fillText("元", 750, 775);
  ctx.fillText("温馨提示", 180, 860);
  ctx.fillText("1.此凭条不可作为乘车凭证使用", 40, 900);
  ctx.fillText("，请您持购票证件进站检票乘车", 40, 940);
  ctx.fillText("。", 40, 980);
  ctx.fillText("2.为方便您在网上办理行程变更", 40, 1020);
  ctx.fillText("手续，建议在行程结束后按需领", 40, 1060);
  ctx.fillText("取报销凭证。", 40, 1100);
  ctx.fillText("3.欢迎扫码查阅乘车须知、下载", 40, 1140);
  ctx.fillText("铁路12306APP。", 40, 1180);
  ctx.font = "35px 宋体";
  ctx.fillText("请按行程信息提示乘车，祝您旅途愉快！", 100, 1250);
  ctx.font = "30px 宋体";
  ctx.fillText("出单：", 145, 1300);
  cusGen(); //调用函数填充可变内容
}

function pyLocation(lastPointer, turn) {
  //本函数用于计算始发到达站拼音和车次号的x坐标位置，以便更好与其他元素对齐
  if (turn == 1) {
    //计算始发站拼音位置
    return (lastPointer - 60) / 2 + 90 - (depPy.length / 2) * 13 - 5;
  } else if (turn == 2) {
    //计算车次号位置
    return lastPointer - 125 / 2 - (trainNumber.length / 2) * 13 - 5;
  } else if (turn == 3) {
    //计算到达站拼音位置
    return (lastPointer + 30 - temp) / 2 + temp - (depPy.length / 2) * 13 - 5;
  }
}

function cusGen() {
  //本函数用于填充可变文字
  ctx.font = "30px 宋体";
  ctx.fillText("开车时间：", (pointer += 40), 325);
  ctx.fillText(depYear, (pointer += 150), 325);
  ctx.fillText("年", (pointer += 60), 325);
  ctx.font = "60px 宋体";
  if (depMonth != 0 && depDay != 0) {
    //本判断语句为极其早期所写，后期将进行进一步优化
    //fillText()方法可以传入第三个参数，用于限制本次填充的文字的最大宽度，因此可以做出文字细长效果
    if (depMonth >= 0 && depMonth < 10) {
      //月份为一位数
      ctx.fillText(depMonth, (pointer += 35), 320, 15);
      ctx.font = "30px 宋体";
      ctx.fillText("月", (pointer += 15), 325); //指针移动15px
    } else if (depMonth >= 10) {
      //月份为两位数
      ctx.fillText(depMonth, (pointer += 35), 320, 35);
      ctx.font = "30px 宋体";
      ctx.fillText("月", (pointer += 35), 325); //指针移动35px
    }
    if (depDay >= 0 && depDay < 10) {
      //日期为一位数
      ctx.font = "60px 宋体";
      ctx.fillText(depDay, (pointer += 35), 320, 15);
      ctx.font = "30px 宋体";
      ctx.fillText("日", (pointer += 15), 325); //指针移动15px
    } else if (depDay >= 10) {
      //日期为两位数
      ctx.font = "60px 宋体";
      ctx.fillText(depDay, (pointer += 35), 320, 35);
      ctx.font = "30px 宋体";
      ctx.fillText("日", (pointer += 35), 325); //指针移动35px
    }
    ctx.font = "60px 宋体";
    ctx.fillText(depTime, (pointer += 85), 320, 95); //填充开车时间
  } else {
    //如果没有传入的日期参数，那么只显示占位符（年月日）
    ctx.font = "30px 宋体";
    ctx.fillText("月", 320, 325);
    ctx.fillText("日", 390, 325);
    ctx.font = "60px 宋体";
    ctx.fillText(depTime, 475, 320, 95);
  }
  ctx.font = "45px 宋体";
  ctx.fillText(depStation, (pointer1 += 90), 390); //填充出发站中文
  ctx.font = "30px 宋体";
  pointer1 += depStation.length * 45; //指针移动站名长度*45px
  ctx.fillText("站", pointer1, 390);
  ctx.font = "30px Times New Roman";
  ctx.fillText(depPy, pyLocation(pointer1, 1), 430); //填充出发站拼音，调用函数确定位置
  pointer1 += 30;
  ctx.setLineDash([]); //重新设置绘制类型为直线
  ctx.beginPath(); //开始绘制直线
  ctx.moveTo((pointer1 += 80), 400); //起点为(指针位置+80px,400)
  ctx.lineTo((pointer1 += 125), 400); //终点为(指针位置+125px,400) 绘制长度45px
  ctx.stroke(); //结束绘制
  ctx.fillText(trainNumber, pyLocation(pointer1, 2), 390);
  ctx.font = "45px 宋体";
  ctx.fillText(arrStation, (pointer1 += 80), 390); //填充到达站中文
  temp = pointer1; //将现在的指针位置保存为temp，以便运算到达站拼音位置
  ctx.font = "30px 宋体";
  pointer1 += arrStation.length * 45; //指针移动站名长度*45px
  ctx.fillText("站", pointer1, 390);
  ctx.font = "30px Times New Roman";
  ctx.fillText(arrPy, pyLocation(pointer1, 3), 430); //填充到达站拼音，调用函数确定位置
  ctx.font = "60px 宋体";
  temp2 = 750 - 23 * ticketCheck.length + 30; //确定检票口信息填充x坐标
  ctx.fillText(ticketCheck, temp2, 530, 23 * ticketCheck.length); //填充检票口信息，限制每个字符宽度平均为23px
  ctx.fillText(seatNumber, 40, 530, 23 * seatNumber.length); //填充座位号信息，限制每个字符宽度平均为23px
  temp3 = 750 - 23 * fare.length; //确定票价信息填充x坐标
  ctx.fillText(fare, temp3, 775, 23 * fare.length); //填充票价信息，限制每个字符宽度平均为23px
  ctx.font = "30px 宋体";
  if (ticketCheck != "") ctx.fillText("检票口：", temp2 - 110, 530); //如果检票口信息不为空，那么填充“检票口”三个汉字
  ctx.fillText("票价：", temp3 - 80, 775); //填充“票价”二字，x坐标为票价信息填充x坐标-80px
  ctx.fillText(seatType, 40 + 23 * seatNumber.length + 10, 530); //填充坐席类别，x坐标为座位号尾部+10px
  ctx.fillText(name, 40, 610); //填充姓名
  ctx.fillText(idNo + " " + idTypeEng + " " + idTypeChn, 40, 650); //填充身份证件号码+类型代码+类型中文
  code1 = TMIS.concat(machineType, machineNo); //拼接车站TMIS+出票机器类型+机器号
  ctx.fillText("电子票号：" + ticketNo, 40, 690); //填充电子票号
  ctx.fillText("订 单 号：" + orderNo, 40, 775); //填充订单号
  ctx.fillText(code1 + " " + prtDate + " " + prtTime, 235, 1300); //填充code1(车站TMIS+出票机器类型+机器号)和打印日期时间
}
button.addEventListener("click", function () {
  //单击按钮执行初始化函数
  init();
});
document.onkeydown = function (event) {
  //按下回车键与单击按钮效果相同
  if (event.keyCode == 13) {
    //键码13为回车键
    init();
  }
};
