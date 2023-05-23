import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Game from "./game/game";

// root of the app
// renders the entire app in the div with id "root"
ReactDOM.render(
    <React.StrictMode>
        <Game />
    </React.StrictMode>,
    document.getElementById("root")
);
