var canv = document.getElementById("canvas");
var ctx = canv.getContext("2d"); //Create canvas and pointer
var easy = document.getElementById("easy");
var hard = document.getElementById("hard");
var insane = document.getElementById("insane"); //Three checkbox objects
//Define several variables for later use
var startX = 0;
var startY = 0;
var panelX = 0;
var flag = false;
var score = 0;
var intervalTime = 30;
var mainInterval;
var leftInterval;
var rightInterval;
//var testI = 0;
function debounce(func, wait, imme) {
  //This function can lower the bounce when the keyboard keys are pressed
  //Bounce means that a single key press is treated like mutiple presses in the code
  //Func is the function you want to debounce, wait is the timeout that a second press is counted
  //Imme is a boolean argument, if you don't want any timeout, please set it as 'true'
  //Thanks to Peter Mortensen on Stackoverflow forum
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
  //Avoid multiple checkboxes from being selected at the same time
}

function readCheckbox() {
  if (easy.checked) {
    return 30;
  } else if (hard.checked) {
    return 20;
  } else if (insane.checked) {
    return 10;
  } else {
    return 30;
  }
  //Check which checkbox is being selected and return the matching interval
}

function prep() {
  //Generate random numbers for the position of the ball and the panel separately
  //The generating process will continue until a number between the limits are found
  //10 px<startX<390 px: avoid getting in to the border (the radius of the ball is 10 px)
  //10 px<startY<380 px: avoid getting in to the border and game over at the beginning
  //0 px<panelX<350 px: avoid getting in to the border (the length of the panel is 50 px)
  while (true) {
    startX = Math.floor(Math.random() * 1000);
    if (startX > 10 && startX < 390) {
      break;
    } else {
      continue;
    }
  }
  while (true) {
    startY = Math.floor(Math.random() * 1000);
    if (startY > 10 && startY < 380) {
      break;
    } else {
      continue;
    }
  }
  while (true) {
    panelX = Math.floor(Math.random() * 1000);
    if (panelX > 0 && panelX < 350) {
      break;
    } else {
      continue;
    }
  }
}
var ball = {
  //Define items about the bouncing ball
  //Including position and internal moving and collision detect functions
  x: startX,
  y: startY,
  //Moving steps
  xSpeed: -2,
  ySpeed: -2,
  draw: function () {
    ctx.fillStyle = "Red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, false); //Draw the ball
    ctx.fill();
  },
  move: function (panelSt, panelEn) {
    if (this.x + this.xSpeed < 10 || this.x + this.xSpeed > 390) {
      this.xSpeed = -this.xSpeed; //Reached left/right border, bounce
    } else {
      this.x += this.xSpeed; //Continue moving
    }
    if (this.y + this.ySpeed < 10 || this.y + this.ySpeed > 390) {
      this.ySpeed = -this.ySpeed; //Reached top border
    } else if (this.y + this.ySpeed >= 380 && this.y + this.ySpeed <= 390) {
      //Reached the panel area, perform collision detection
      if (this.x > panelSt - 10 && this.x < panelEn + 10) {
        this.ySpeed = -this.ySpeed;
        score += 5;
        //Reached the panel, bounce and score up by 5 pts
      } else {
        //this.y += this.ySpeed;
        window.alert("Game over!");
        //this.x = 0;
        //this.y = 0;
        score = 0;
        flag = true;
        //Missed the panel, report game over, set the score to 0 and request init
      }
    } else {
      this.y += this.ySpeed; //Continue moving
    }
  },
};
var panel = {
  //Define items about the panel
  //Including position and x-axis keyboard control functions
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
  if (event.keyCode == 65) {
    //'A' key, move left
    //console.log("Left!",testI);
    //testI++;
    panel.x -= 8;
    if (panel.x < 0) {
      panel.x = 0; //Exceed the left border limit, set x to 0
    }
  }
  if (event.keyCode == 68) {
    //'D' key, move right
    //console.log("Right!",testI);
    //testI++;
    panel.x += 8;
    if (panel.x > 400 - panel.xSize) {
      panel.x = 400 - panel.xSize; //Exceed the right border limit, set x to the max value available
    }
  }
}
//Invoke the debounce function
var dbPanelKey = debounce(keyPanel, 20);

function leftClick() {
  panel.x -= 15;
  if (panel.x < 0) {
    panel.x = 0;
  }
  //If left button pressed then move left, only do this if press time is less than 100 ms
  leftInterval = setInterval(function () {
    panel.x -= 15;
    if (panel.x < 0) {
      panel.x = 0;
    }
  }, 100);
  //If long press then move left every 100 ms
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
  //The same to right button
}
const leftButton = document.getElementById("leftButton"); //Define 'left' button object
leftButton.addEventListener("mousedown", leftClick); //Monitor if 'left' button is pressed
leftButton.addEventListener("mouseup", function () {
  clearInterval(leftInterval);
}); //If released then stop the timer
const rightButton = document.getElementById("rightButton"); //Define 'right' button object
rightButton.addEventListener("mousedown", rightClick); //The same to right button
rightButton.addEventListener("mouseup", function () {
  clearInterval(rightInterval);
});
window.addEventListener("keydown", dbPanelKey); //Monitor keyboard press
//Refresh the ball movement after a set period of time
function start() {
  clearInterval(mainInterval);
  score = 0;
  prep();
  ball.x = startX;
  ball.y = startY;
  panel.x = panelX;
  clearInterval(leftInterval);
  clearInterval(rightInterval);
  intervalTime = readCheckbox(); //This interval is determined by the checkbox (easy=30ms, hard=20ms, insane=10ms, default=30ms)
  mainInterval = setInterval(function () {
    if (flag == true) {
      //Perform init because game over last time, redefine the ball and panel position
      prep();
      ball.x = startX;
      ball.y = startY;
      panel.x = panelX;
      flag = false;
      clearInterval(leftInterval);
      clearInterval(rightInterval); //If died last time, then reset the timer to prevent the panel from moving randomly
    } else {
      ctx.clearRect(0, 0, 400, 400); //Clear the square area last time
      ctx.font = "20px Arial"; //Select the font for score display
      ctx.fillText("score:" + score, 10, 30); //Write the score on the canvas
      ball.draw(); //Invoke the drawing function of the ball
      panel.draw(); //Invoke the drawing function of the panel
      ball.move(panel.x, panel.x + panel.xSize); //Invoke the move and collision detection function of the ball
      ctx.strokeRect(0, 0, 400, 400); //Mark the square area of the canvas
    }
  }, intervalTime);
}
