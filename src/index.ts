import * as PIXI from "pixi.js";
import { AddTextOptions, addText } from "./utils/text";
import Coordinates from "./utils/coordintes";
import joinGame from "./game/joingame";

const bodyElement = document.getElementsByTagName("body")[0];
joinGame(bodyElement);

const app = new PIXI.Application<HTMLCanvasElement>();
app.resizeTo = window;
window.addEventListener("resize", () => app.resize());
document.body.appendChild(app.view);
app.stage.addChild(
    addText(
        "COSMIC BLITZ",
        new AddTextOptions()
            .changeCoordinates(new Coordinates(app.view.width / 2, 0))
            .changeFontSize(app.view.width / 15)
            .changeAnchorY("up")
    )
);
