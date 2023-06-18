import colours from "../../constants/colour";
import map1 from "./map1";

export function getWidth() {
    return window.innerWidth;
}

export function getHeight() {
    return window.innerHeight;
}

export function transform(bodies: any[]) {
    for (let body of bodies) {
        body.isStatic = true;
        body.render.zIndex = 2;
        body.render.fillStyle = "#" + colours.error;
    }
    return bodies;
}

export let maps = [map1];
