import { Application, Text, TextStyle, TextStyleFill } from "pixi.js";
import Coordinates from "./coordintes";

export class AddTextOptions {
    coordinates: Coordinates = new Coordinates(0, 0);
    anchorX: "center" | "left" = "center";
    anchorY: "center" | "up" = "center";
    fontSize: number = 200;
    fill: TextStyleFill = "#ffffff";
    stroke: string | null = "#000000";
    wordWrapWidth: number | null = window.innerWidth;

    changeCoordinates(coordinates: Coordinates) {
        this.coordinates = coordinates;
        return this;
    }

    changeFontSize(fontSize: number) {
        this.fontSize = fontSize;
        return this;
    }

    changeFill(fill: TextStyleFill) {
        this.fill = fill;
        return this;
    }

    changeStroke(stroke: string | null) {
        this.stroke = stroke;
        return this;
    }

    changeWordWrapWidth(wordWrapWidth: number | null) {
        this.wordWrapWidth = wordWrapWidth;
        return this;
    }

    changeAnchorX(anchorX: "center" | "left") {
        this.anchorX = anchorX;
        return this;
    }

    changeAnchorY(anchorY: "center" | "up") {
        this.anchorY = anchorY;
        return this;
    }
}

export function addText(text: string, options: AddTextOptions) {
    const style = new TextStyle({
        fontFamily: "Rubik Pixels",
        fontSize: options.fontSize,
        fill: options.fill,
        stroke: options.stroke ?? undefined,
        strokeThickness: !options.stroke ? 0 : Math.sqrt(options.fontSize),
        wordWrap: options.wordWrapWidth ? true : false,
        wordWrapWidth: options.wordWrapWidth ?? undefined,
    });
    const richText = new Text(text, style);
    richText.x = options.coordinates.x;
    richText.y = options.coordinates.y;
    richText.anchor.set(
        options.anchorX == "center" ? 0.5 : 0,
        options.anchorY == "center" ? 0.5 : 0
    );

    return richText;
}
