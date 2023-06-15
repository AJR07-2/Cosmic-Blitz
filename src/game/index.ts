import { AddTextOptions, addText } from "../display/text";
import Coordinates from "../utils/coordinates";
import { ButtonContainer, ScrollBox } from "@pixi/ui";
import colours, { playerColour } from "../colours/colour";
import { basicInteractivity } from "../display/button";
import Player from "./player";
import Stage from "./stages";
import { Application, Assets, Container, Graphics, Sprite } from "pixi.js";

export default class Engine {
    app: Application<HTMLCanvasElement> = new Application<HTMLCanvasElement>();
    players: {
        [id: number]: Player;
    } = {};
    stage: Stage = Stage.START;

    constructor() {
        this.initApp();
        this.buildStartUI();
    }

    initApp() {
        this.app.resizeTo = window;
        window.addEventListener("resize", () => this.app.resize());
        document.body.appendChild(this.app.view);
    }

    async initPlayers(id: number) {
        let player = new Player(id);
        this.players[id] = player;

        // build UI
        const play = new ButtonContainer(
            new Graphics()
                .beginFill(playerColour[id - 1])
                .drawRoundedRect(
                    (this.getWidth() * (id * 2 - 1)) / 9,
                    this.getHeight() / 4 - this.getHeight() / 20,
                    this.getWidth() / 8,
                    this.getHeight() / 10,
                    10
                )
        ).view;

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

        const playerIndicator = new Sprite(
            await Assets.load(`/players/Player${id}.png`)
        );
        playerIndicator.anchor.set(0.5);
        playerIndicator.x =
            (this.getWidth() * (id * 2 - 1)) / 9 + this.getWidth() / 16;
        playerIndicator.y = this.getHeight() / 4 + this.getHeight() / 7;
        playerIndicator.width = this.getWidth() / 16;
        playerIndicator.height = this.getWidth() / 16;
        play.addChild(playerIndicator);

        play.onclick = () => {
            if (this.players[id]) {
                delete this.players[id];
                play.alpha = 0.5;
                playerIndicator.alpha = 0;
            } else {
                this.players[id] = new Player(id);
                play.alpha = 1;
                playerIndicator.alpha = 1;
            }
        };

        this.app.stage.addChild(play);
    }

    getWidth() {
        return this.app.view.width;
    }

    getHeight() {
        return this.app.view.height;
    }

    setStages(stage: Stage) {
        this.stage = stage;
        switch (stage) {
            case Stage.START:
                this.buildStartUI();
                break;
            case Stage.INFO:
                this.buildInfoUI();
                break;
            case Stage.GAME:
                // this.buildGameUI();
                break;
            case Stage.END:
                // this.buildEndUI();
                break;
        }
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
                new Graphics()
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
        start.onclick = () => {
            this.app.stage.removeChildren();
            this.setStages(Stage.INFO);
        };

        this.app.stage.addChild(start);
        for (let i = 1; i <= 4; i++) this.initPlayers(i);
    }

    async buildInfoUI() {
        const text = await (await fetch(`/story.txt`)).text();
        const instructions = text.split("\n\n");
        // this.app.stage.addChild(scroll);
    }
}
