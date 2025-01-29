// 莫尔斯电码字典，字母、数字和部分标点符号的对应莫尔斯电码表示
const morseCode = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    _: "..--.-",
    '"': ".-..-.",
    $: "...-..-",
    "@": ".--.-."
};

let audioContext; // 用于音频处理的AudioContext对象
let currentTimeouts = []; // 用于存储所有 setTimeout 引用，以便在需要时清除
let isPlaying = false; // 表示是否正在播放
let currentIndex = 0; // 当前播放的莫尔斯符号的索引
let words = []; // 转换后的莫尔斯电码序列
let dotDuration, dashDuration, elementGap, letterGap, wordGap; // 各种间隔和时长
let currentFrequency = 600; // 当前音频频率，默认为600Hz
let currentPath = window.location.pathname;

// 创建并初始化AudioContext
function createAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// 将文本转换为莫尔斯电码，返回由.和-组成的字符串
function textToMorse(text) {
    return text
        .toUpperCase()
        .split("")
        .map((char) => morseCode[char] || " ")
        .join(" ");
}

// 播放指定频率和时长的声音
function playSound(frequency, duration) {
    const oscillator = audioContext.createOscillator(); // 创建一个声音发生器
    oscillator.type = "sine"; // 设置声音类型为正弦波
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // 设置频率
    oscillator.connect(audioContext.destination); // 将声音输出到音频输出设备
    oscillator.start(); // 开始播放
    oscillator.stop(audioContext.currentTime + duration); // 在指定的时长后停止
}

// 根据WPM（每分钟单词数）计算每个点的时长
function getDotDuration(wpm) {
    return 1200 / wpm; // 1200ms/WPM等于一个点的时长
}

// 清除所有已设置的定时器
function clearTimeouts() {
    currentTimeouts.forEach((timeout) => clearTimeout(timeout)); // 逐一清除所有setTimeout
    currentTimeouts = []; // 清空定时器数组
}

// 播放下一个莫尔斯电码符号
function playNextSymbol() {
    // 如果已经停止播放或播放到末尾，退出函数
    if (!isPlaying || currentIndex >= words.length) {
        return;
    }

    const symbol = words[currentIndex]; // 获取当前要播放的符号
    let timeoutDuration = 0; // 定时器的时长

    if (symbol === ".") {
        // 播放点
        playSound(currentFrequency, dotDuration / 1000); // 将点的时长转换为秒
        timeoutDuration = dotDuration + elementGap; // 点后面跟着元素间隔
    } else if (symbol === "-") {
        // 播放划
        playSound(currentFrequency, dashDuration / 1000); // 划的时长是点的三倍
        timeoutDuration = dashDuration + elementGap;
    } else if (symbol === " ") {
        // 字符间间隔
        timeoutDuration = letterGap;
    } else if (symbol === "   ") {
        // 单词间间隔
        timeoutDuration = wordGap;
    }

    currentIndex++; // 播放下一个符号
    const timeoutId = setTimeout(playNextSymbol, timeoutDuration); // 设置下一个符号的播放
    currentTimeouts.push(timeoutId); // 保存定时器的引用，便于清除
}

// 准备并开始播放莫尔斯电码
function playMorse(wpm, freq) {
    // 计算各种时长：点、划、元素间隔、字母间隔、单词间隔
    dotDuration = getDotDuration(wpm);
    dashDuration = 3 * dotDuration;
    elementGap = dotDuration;
    letterGap = 3 * dotDuration;
    wordGap = 7 * dotDuration;

    // 获取输入框的文本并转换为莫尔斯电码
    const text = document.getElementById("textInput").value.trim();
    const morseText = text
        .split(" ")
        .map((word) => textToMorse(word))
        .join("   ");
    words = morseText.split(""); // 将转换后的莫尔斯电码拆分为字符数组
    currentFrequency = freq; // 设置当前频率
    currentIndex = 0; // 从第一个符号开始播放
    isPlaying = true; // 设置播放状态
    clearTimeouts(); // 清除之前的定时器，防止多次点击时播放冲突
    playNextSymbol(); // 开始播放第一个符号
}

// 验证输入内容是否合法（只允许字母、数字和部分标点符号）
function validateInput(text) {
    const validChars = /^[A-Za-z0-9.,?'!()/&:;=+-_"$@ ]*$/; // 允许的字符集
    return validChars.test(text); // 返回是否匹配
}

// 准备播放过程
function preparation() {
    const textInput = document.getElementById("textInput").value; // 获取用户输入

    // 验证输入是否合法
    if (!validateInput(textInput)) {
        if (currentPath.includes("en")) {
            document.getElementById("error").textContent = "Invalid input! Please use only letters, numbers and following symbols: .,?'!()/&:;=+-_\"$@";
        } else {
            document.getElementById("error").textContent = "输入包含无效字符，请使用字母、数字和以下特殊符号：.,?'!()/&:;=+-_\"$@";
        }
        return;
    } else {
        document.getElementById("error").textContent = ""; //清空错误信息
    }

    // 如果音频上下文不存在或已关闭，重新创建一个
    if (!audioContext || audioContext.state === "closed") {
        createAudioContext();
    }

    const WPM = Number(document.getElementById("WPM").value); // 获取用户设置的WPM
    const fq = Number(document.getElementById("fq").value); // 获取用户设置的频率
    playMorse(WPM, fq); // 开始播放莫尔斯电码
}

// 暂停播放
function pauseSound() {
    isPlaying = false; // 设置播放状态为暂停
}

// 继续播放
function resumeSound() {
    if (!isPlaying) {
        // 如果当前未播放，才继续
        isPlaying = true;
        playNextSymbol(); // 从当前符号继续播放
    }
}

// 停止播放
function stopSound() {
    isPlaying = false; // 停止播放
    currentIndex = 0; // 重置播放索引
    clearTimeouts(); // 停止播放时清除所有定时器
}

function downloadMorse() {
    //下载莫尔斯代码到文本文件
    const text = document.getElementById("textInput").value.trim();
    const morseText = text
        .split(" ")
        .map((word) => textToMorse(word))
        .join(" ");
    const blob = new Blob([morseText], {type: "text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "morse_code.txt";
    link.click();
}
