import * as PIXI from "pixi.js";
import { AddTextOptions, addText } from "../display/text";
import Coordinates from "../utils/coordinates";
import { Button, ButtonContainer } from "@pixi/ui";
import colours from "../colours/colour";
import { basicInteractivity } from "../display/button";

export default class Engine {
    app: PIXI.Application<HTMLCanvasElement> =
        new PIXI.Application<HTMLCanvasElement>();

    constructor() {
        this.addApp();
        this.buildStartUI();
    }

    addApp() {
        this.app.resizeTo = window;
        window.addEventListener("resize", () => this.app.resize());
        document.body.appendChild(this.app.view);
    }

    buildStartUI() {
        this.app.stage.addChild(
            addText(
                "COSMIC BLITZ",
                new AddTextOptions()
                    .changeCoordinates(new Coordinates(this.getWidth() / 2, 0))
                    .changeFontSize(this.getHeight() / 15)
                    .changeAnchorY("up")
            )
        );

        const start = new ButtonContainer(
            new PIXI.Graphics()
                .beginFill(colours.primary)
                .drawRoundedRect(
                    this.getWidth() / 2 - this.getWidth() / 10,
                    this.getHeight() / 2 - this.getHeight() / 20,
                    this.getWidth() / 5,
                    this.getHeight() / 10,
                    10
                )
        ).view;
        basicInteractivity(start);

        start.addChild(
            addText(
                "START",
                new AddTextOptions()
                    .changeCoordinates(
                        new Coordinates(
                            this.getWidth() / 2,
                            this.getHeight() / 2
                        )
                    )
                    .changeFontSize(this.getHeight() / 15)
                    .changeAnchorX("center")
                    .changeAnchorY("center")
            )
        );

        this.app.stage.addChild(start);
    }

    getWidth() {
        return this.app.view.width;
    }

    getHeight() {
        return this.app.view.height;
    }
}
