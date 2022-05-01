import { start, initPlayer, movePlayer, addPlayer , removeKey, addKeyPos} from "./index.js";
import { createButtons } from "./auxFunctions.js";

let socket = io();
var UserId = null;
var finish = false;

function getGames() {
  const payLoad = {
    method: "getGames",
    UserId: UserId,
  };
  socket.emit("getGames", JSON.stringify(payLoad));
}

function createGame(size, needsKey) {
  const payLoad = {
    method: "create",
    userId: UserId,
    size: size,
    needsKey: needsKey,
  };

  socket.emit("create", JSON.stringify(payLoad));
}

function joinGame(gameId) {
    console.log(gameId)
  const payLoad = {
    method: "join",
    gameId: gameId,
    userId: UserId
  };
  socket.emit("join", JSON.stringify(payLoad));
}

function move(currPos, direction) {
  const payLoad = {
    method: "move",
    currPos: currPos,
    direction: direction,
    UserId: UserId,
  };

  socket.emit("move", JSON.stringify(payLoad));
}

function foundKey(userId) {
    console.log("AAAAAAAAAAAA")
    const payLoad = {
      method: "foundKey",
      UserId: UserId
    };

    socket.emit("foundKey", JSON.stringify(payLoad));
}

socket.on("getGames", function (msg) {
  const result = JSON.parse(msg);
  let gamesIds = result.gamesIds;
  console.log("funcionaa");
  for (var i = 0; i < gamesIds.length; i++) console.log(gamesIds[i]);
  createButtons(gamesIds);
});

socket.on("create", function (msg) {
  const result = JSON.parse(msg);
  const gameId = result.gameId;
  const keyPos = result.keyPos;
  console.log(keyPos);
  addKeyPos(keyPos);
  start(result.maze);
  joinGame(gameId);
});

socket.on("join", function (msg) {
  const result = JSON.parse(msg);
  const userId = result.userId;
  const color = result.color;
  const maze = result.maze;
  const players = result.players;
  const colors = result.colors;
  initPlayer(userId, color, maze);
  for (var i = 0; i < players.length; i++) {
    addPlayer(players[i], colors[i]);
    console.log("player added with id: ", players[i]);
  }
});

socket.on("foundKey", function(msg) {
    const result = JSON.parse(msg);
    removeKey();
})

socket.on("add", function (msg) {
  const result = JSON.parse(msg);
  const userId = result.userId;
  const color = result.color;
  addPlayer(userId, color);
});

socket.on("move", function (msg) {
  const result = JSON.parse(msg);
  console.log(result.nextPos);
  console.log(result.userId);
  const userId = result.userId;
  const prevPos = result.prevPos;
  const nextPos = result.nextPos;
  movePlayer(userId, prevPos, nextPos);
});

socket.on("connection", function (msg) {
  const result = JSON.parse(msg);
  UserId = result.userId;
  console.log(UserId);
  getGames();
  console.log("Connection set successfully with user" + UserId);
});

socket.on("finish", function (msg) {
 alert("There is a WINNNER!");
  });

socket.on("reload", function (msg) {
 document.location.reload(true);
})

export { createGame, joinGame, move , foundKey, UserId};