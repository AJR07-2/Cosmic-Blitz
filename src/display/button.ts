import { Container, DisplayObject } from "pixi.js";

export function basicInteractivity(button: Container<DisplayObject>) {
    button.onmouseover = () => {
        button.alpha = 0.8;
    };

    button.onmouseout = () => {
        button.alpha = 1;
    };
}
