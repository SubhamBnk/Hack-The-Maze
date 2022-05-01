import { joinGame } from './htmlscript.js';

function createButtons(gamesIds) {
    console.log(gamesIds);
    let joinButtons = document.getElementById("join-button");
    console.log(gamesIds);
    let button = [];
    for (let b = 0; b<gamesIds.length;b++) {
        console.log("hola")
        button.push(document.createElement("button"));
        button[b].innerHTML="Join Game " + b;
        button[b].id = b;
        joinButtons.appendChild(button[b]);
        button[b].dataset.num = b;
        button[b].addEventListener("click", function(event) {
            console.log(gamesIds)
            console.log(gamesIds[button[b].dataset.num])
            joinGame(gamesIds[button[b].dataset.num]);
        });
    }
}

export { createButtons }
