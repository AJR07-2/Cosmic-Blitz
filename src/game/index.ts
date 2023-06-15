import * as PIXI from "pixi.js";
import { AddTextOptions, addText } from "../display/text";
import Coordinates from "../utils/coordinates";
import { Button, ButtonContainer } from "@pixi/ui";
import colours, { playerColour } from "../colours/colour";
import { basicInteractivity } from "../display/button";
import Player from "./player";

export default class Engine {
    app: PIXI.Application<HTMLCanvasElement> =
        new PIXI.Application<HTMLCanvasElement>();
    players: {
        [id: number]: Player;
    } = {};

    constructor() {
        this.initApp();
        this.buildStartUI();
    }

    initApp() {
        this.app.resizeTo = window;
        window.addEventListener("resize", () => this.app.resize());
        document.body.appendChild(this.app.view);
    }

    initPlayers(id: number) {
        let player = new Player(id);
        this.players[id] = player;

        // build UI
        const play = new ButtonContainer(
            new PIXI.Graphics()
                .beginFill(playerColour[id - 1])
                .drawRoundedRect(
                    (this.getWidth() * (id * 2 - 1)) / 9,
                    this.getHeight() / 4 - this.getHeight() / 20,
                    this.getWidth() / 8,
                    this.getHeight() / 10,
                    10
                )
        ).view;
        play.onclick = () => {
            if (this.players[id]) {
                delete this.players[id];
                play.alpha = 0.5;
            } else {
                this.players[id] = new Player(id);
                play.alpha = 1;
            }
        };

        play.addChild(
            addText(
                `PLAYER ${id}`,
                new AddTextOptions()
                    .changeCoordinates(
                        new Coordinates(
                            (this.getWidth() * (id * 2 - 1)) / 9 +
                                this.getWidth() / 16,
                            this.getHeight() / 4
                        )
                    )
                    .changeFontSize(this.getHeight() / 20)
                    .changeAnchorX("center")
                    .changeAnchorY("center")
                    .changeStroke(0)
            )
        );

        this.app.stage.addChild(play);
    }

    buildStartUI() {
        this.app.stage.addChild(
            addText(
                "COSMIC BLITZ",
                new AddTextOptions()
                    .changeCoordinates(new Coordinates(this.getWidth() / 2, 0))
                    .changeFontSize(this.getHeight() / 5)
                    .changeAnchorY("up")
            )
        );

        const start = basicInteractivity(
            new ButtonContainer(
                new PIXI.Graphics()
                    .beginFill(colours.success)
                    .drawRoundedRect(
                        this.getWidth() / 2 - this.getWidth() / 10,
                        (this.getHeight() * 3) / 4 - this.getHeight() / 20,
                        this.getWidth() / 5,
                        this.getHeight() / 10,
                        10
                    )
            ).view
        );

        start.addChild(
            addText(
                "START",
                new AddTextOptions()
                    .changeCoordinates(
                        new Coordinates(
                            this.getWidth() / 2,
                            (this.getHeight() * 3) / 4
                        )
                    )
                    .changeFontSize(this.getHeight() / 15)
                    .changeAnchorX("center")
                    .changeAnchorY("center")
            )
        );
        this.app.stage.addChild(start);
        for (let i = 1; i <= 4; i++) this.initPlayers(i);
    }

    getWidth() {
        return this.app.view.width;
    }

    getHeight() {
        return this.app.view.height;
    }
}
