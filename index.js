import { colors } from "./consts.js";
import { createGame, move, foundKey, UserId } from "./htmlscript.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var mW = null;
var mH = null;
var mazeMap = null;
var audioElement = new Audio("./tetris-theme.mp3");
var keyCoords = [1, 1];

var slider = document.getElementById("sizeSlider");
var sliderValue = document.getElementById("sliderValue");
sliderValue.innerText = slider.value;
slider.oninput = function () {
  sliderValue.innerText = this.value;
};

var ready = true;
var offset = 1;

let create = document.getElementById("create");
let keyCheckbox = document.getElementById("keyCheckbox");

create.addEventListener("click", (e) => {
  console.log(keyCheckbox.checked);
  createGame(parseInt(slider.value), keyCheckbox.checked);
});

/* Gestures mobile */
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

function handleGesture(touchstartX, touchstartY, touchendX, touchendY) {
  const delx = touchendX - touchstartX;
  const dely = touchendY - touchstartY;
  if (Math.abs(delx) > Math.abs(dely)) {
    if (delx > 0) {
      move(players[Object.keys(players)[0]], "down");
    } else {
      move(players[Object.keys(players)[0]], "up");
    }
  } else if (Math.abs(delx) < Math.abs(dely)) {
    if (dely > 0) {
      move(players[Object.keys(players)[0]], "right");
    } else {
      move(players[Object.keys(players)[0]], "left");
    }
  }
}

const gestureZone = document.getElementById("canvas");
gestureZone.addEventListener(
  "touchstart",
  function (event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
  },
  false
);

gestureZone.addEventListener(
  "touchend",
  function (event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(touchstartX, touchstartY, touchendX, touchendY);
  },
  false
);

/* Arrow Keys */
document.addEventListener("keydown", function (event) {
  if (ready) {
    ready = false;
    switch (event.key) {
      case "ArrowLeft":
        move(players[Object.keys(players)[0]], "up");
        break;
      case "ArrowRight":
        move(players[Object.keys(players)[0]], "down");
        break;
      case "ArrowUp":
        move(players[Object.keys(players)[0]], "left");
        break;
      case "ArrowDown":
        move(players[Object.keys(players)[0]], "right");
        break;
      default:
        ready = true;
        break;
    }
  }
});

function movePlayer(userId, prevPos, nextPos) {
  /* Vertical */
  if (prevPos[1] === nextPos[1]) {
    if (prevPos[0] > nextPos[0]) {
      /* Up */
      animatePlayerUp(userId, nextPos);
    } else if (prevPos[0] < nextPos[0]) {
      /* Down */
      console.log("a: ", userId);
      animatePlayerDown(userId, nextPos);
    }
    console.log(keyCoords);
    if (
      ((prevPos[0] <= keyCoords[0] &&
        keyCoords[0] <= nextPos[0] &&
        keyCoords[1] == prevPos[1]) ||
        (prevPos[0] >= keyCoords[0] &&
          keyCoords[0] >= nextPos[0] &&
          keyCoords[1] == prevPos[1])) &&
      userId == UserId
    ) {
      console.log("trobada: ", keyCoords);
      foundKey(userId);
    }
  }
  if (prevPos[0] === nextPos[0]) {
    /* Horizontal */
    if (prevPos[1] > nextPos[1]) {
      /* Left */
      animatePlayerLeft(userId, nextPos);
    } else if (prevPos[1] < nextPos[1]) {
      /* Right */
      animatePlayerRight(userId, nextPos);
    }
    if (
      ((prevPos[1] <= keyCoords[1] &&
        keyCoords[1] <= nextPos[1] &&
        keyCoords[0] == prevPos[0]) ||
        (prevPos[1] >= keyCoords[1] &&
          keyCoords[1] >= nextPos[1] &&
          keyCoords[0] == prevPos[0])) &&
      userId == UserId
    ) {
      console.log("trobada: ", keyCoords);
      foundKey(userId);
    }
  }
  ready = true;
  drawPlayer(userId);
}

function animatePlayerRight(userId, posF) {
  console.log("e: ", userId);
  console.log(players);
  if (players[userId][1] < posF[1]) {
    deletePlayer(userId);
    players[userId][1] = players[userId][1] + offset;
    drawPlayer(userId);
    drawMap(mazeMap);

    requestAnimationFrame(() => {
      animatePlayerRight(userId, posF);
    });
  }
}

function animatePlayerLeft(userId, posF) {
  if (players[userId][1] > posF[1]) {
    deletePlayer(userId);
    players[userId][1] = players[userId][1] - offset;
    drawPlayer(userId);
    drawMap(mazeMap);

    requestAnimationFrame(() => {
      animatePlayerLeft(userId, posF);
    });
  }
}

function animatePlayerUp(userId, posF) {
  if (players[userId][0] > posF[0]) {
    deletePlayer(userId);
    players[userId][0] = players[userId][0] - offset;
    drawPlayer(userId);
    drawMap(mazeMap);

    requestAnimationFrame(() => {
      animatePlayerUp(userId, posF);
    });
  }
}

function animatePlayerDown(userId, posF) {
  if (players[userId][0] < posF[0]) {
    deletePlayer(userId);
    players[userId][0] = players[userId][0] + offset;
    drawPlayer(userId);
    drawMap(mazeMap);

    requestAnimationFrame(() => {
      animatePlayerDown(userId, posF);
    });
  }
}

function addKeyPos(keyPos) {
  if (keyPos == null) {
    keyPos = [1, 1];
    return;
  }
  keyCoords = keyPos;
}

function drawMap(maze) {
  var thereIsKey = false;
  var key_image = new Image();
  key_image.src = "./key.png";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < maze.length; i++) {
    for (var j = 0; j < maze[i].length; j++) {
      switch (maze[i][j]) {
        case 1:
          ctx.fillStyle = colors.colorWall;
          break;
        case 2:
          ctx.fillStyle = colors.colorExit;
          break;
        case 3:
          keyCoords = [i, j];
          ctx.fillStyle = colors.colorKey;
          thereIsKey = true;
          break;
        default:
          ctx.fillStyle = colors.colorBackground;
          break;
      }
      ctx.fillRect(i * mW, j * mH, mW * 1.1, mH * 1.1);
    }
  }
  if (thereIsKey)
    ctx.drawImage(
      key_image,
      keyCoords[0] * mW,
      keyCoords[1] * mH,
      mW * 1.1,
      mH * 1.1
    );
  console.log(key_image);
  for (const [key, value] of Object.entries(players)) {
    drawPlayer(key);
  }
}

var players = {};
var usersColors = {};

function initPlayer(userId, color, maze) {
  start(maze);
  usersColors[userId] = color;
  players[userId] = [1, 1];
  drawPlayer(userId);
}

function addPlayer(userId, color) {
  console.log(color);
  console.log(userId);
  players[userId] = [1, 1];
  usersColors[userId] = color;
}

function deletePlayer(userId) {
  ctx.fillStyle = colors.colorBackground;
  ctx.fillRect(players[userId][0] * mW, players[userId][1] * mH, mW, mH);
}

function drawPlayer(userId) {
  console.log(userId);
  console.log(usersColors[userId]);
  ctx.fillStyle = usersColors[userId];
  var x = players[userId][0];
  var y = players[userId][1];
  ctx.fillRect(x * mW, y * mH, mW, mH);
}

/*
Treure el 3 del mapa, obrir la sortida
*/
function removeKey() {
  console.log("JKAJKSJDS");
  for (var i = 0; i < mazeMap.length; i++) {
    for (var j = 0; j < mazeMap[0].length; j++) {
      if (mazeMap[i][j] == 3) mazeMap[i][j] = 0;
    }
  }
  mazeMap[mazeMap.length - 1][mazeMap.length - 2] = 2;
}

function start(maze) {
  console.log(maze);
  mazeMap = maze;
  document.getElementById("mazeControls").style.display = "none";
  document.getElementById("canvas").style.display = "block";

  audioElement.play();
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  mW = canvas.width / maze.length;
  mH = canvas.height / maze.length;
  drawMap(maze);
}

audioElement.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    this.play();
  },
  false
);

export { start, initPlayer, movePlayer, addPlayer, removeKey, addKeyPos };