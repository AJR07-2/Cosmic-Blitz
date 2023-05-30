import firebaseApp from "../lib/firebase";
import { get, getDatabase, ref, set } from "firebase/database";
import Player from "./player";
import Game from "../types/game";

const rtdb = getDatabase(firebaseApp);

export default function joinGame(body: HTMLBodyElement) {
    // create a game
    let createGameButton = document.createElement("button");
    createGameButton.innerText = "Create Game";
    createGameButton.className = "button create";
    createGameButton.addEventListener("click", () => {
        const gameID = Math.random().toString(36).substring(2, 15);
        const gameRef = ref(rtdb, `games/${gameID}`);
        set(gameRef, {
            map: 0,
            players: [new Player(1)],
        } as Game).then(() => {
            clearBody(body);
            let gameIDText = document.createElement("p");
            gameIDText.innerText = `Game ID: ${gameID}`;
            body.appendChild(gameIDText);
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
                    clearBody(body);
                    let gameIDText = document.createElement("p");
                    gameIDText.innerText = `Game ID: ${gameID}`;
                    body.appendChild(gameIDText);
                });
            });
            body.appendChild(joinGameButton);
        });
    });
}

function clearBody(body: HTMLBodyElement) {
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
}
