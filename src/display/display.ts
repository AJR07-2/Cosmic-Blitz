import * as PIXI from "pixi.js";
import { AddTextOptions, addText } from "../utils/text";
import Coordinates from "../utils/coordinates";

export default class Display {
    app: PIXI.Application<HTMLCanvasElement> =
        new PIXI.Application<HTMLCanvasElement>();
    gameID: string;

    constructor(gameID: string) {
        this.gameID = gameID;

        this.addApp();
        this.buildLoadingUI();
    }

    addApp() {
        this.app.resizeTo = window;
        window.addEventListener("resize", () => this.app.resize());
        document.body.appendChild(this.app.view);
    }

    buildLoadingUI() {
        this.app.stage.addChild(
            addText(
                "COSMIC BLITZ",
                new AddTextOptions()
                    .changeCoordinates(
                        new Coordinates(this.app.view.width / 2, 0)
                    )
                    .changeFontSize(this.app.view.width / 15)
                    .changeAnchorY("up")
            )
        );
    }
}
