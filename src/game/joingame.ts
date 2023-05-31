import firebaseApp from "../lib/firebase";
import { get, getDatabase, ref, set } from "firebase/database";
import Player from "./player";
import Game from "../types/game";
import { setDisplay } from ".";
import Display from "../display/display";

const rtdb = getDatabase(firebaseApp);

export default function joinGame(body: HTMLBodyElement) {
    // create a game
    let createGameButton = document.createElement("button");
    createGameButton.innerText = "Create Game";
    createGameButton.className = "button create";
    createGameButton.addEventListener("click", () => {
        const gameID = Math.random().toString(36).substring(2, 15);
        const gameData = {
            map: 0,
            players: [new Player(1)],
        } as Game;
        const gameRef = ref(rtdb, `games/${gameID}`);
        set(gameRef, gameData).then(() => {
            enterGame(body, gameID, gameData);
        });
    });
    body.appendChild(createGameButton);

    // join a game
    get(ref(rtdb, "games")).then((snapshot) => {
        let gameIDs = Object.entries(snapshot.val());
        gameIDs.forEach((game) => {
            let [gameID, gameData] = game as [string, Game];

            let joinGameButton = document.createElement("button");
            joinGameButton.innerText = `Join Game: ${gameID}`;
            joinGameButton.className = "button join";
            joinGameButton.addEventListener("click", () => {
                let newGameData = gameData;
                newGameData.players.push(
                    new Player(newGameData.players.length + 1)
                );
                set(ref(rtdb, `games/${gameID}`), newGameData).then(() => {
                    enterGame(body, gameID, gameData);
                });
            });
            body.appendChild(joinGameButton);
        });
    });
}

function enterGame(body: HTMLBodyElement, gameID: string, gameData: Game) {
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
    let gameIDText = document.createElement("p");
    gameIDText.innerText = `Game ID: ${gameID}`;
    body.appendChild(gameIDText);

    let gameDataText = document.createElement("p");
    if (gameData.players.length == 1) {
        gameDataText.innerText += "Waiting for players...";
    } else {
        gameDataText.innerText += `Number of Players: ${gameData.players.length}`;
    }
    body.appendChild(gameDataText);

    setDisplay(new Display(gameID));
}
