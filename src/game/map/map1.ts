import * as matter from "matter-js";
import { getHeight, getWidth, transform } from ".";

let map1: any[] = transform([
    matter.Bodies.rectangle(0, getHeight() / 2, 50, getHeight()),
    matter.Bodies.rectangle(getWidth(), getHeight() / 2, 50, getHeight()),
    matter.Bodies.rectangle(getWidth() / 2, 0, getWidth(), 50),
    matter.Bodies.rectangle(getWidth() / 2, getHeight(), getWidth(), 50),
    matter.Bodies.circle(
        getWidth() / 2,
        getHeight() / 2,
        Math.sqrt(getWidth() * getHeight()) / 10
    ),

    // rectangles in spawn
    matter.Bodies.rectangle(
        getWidth() / 4,
        0,
        getWidth() / 40,
        getHeight() / 2
    ),
    matter.Bodies.rectangle(
        getWidth() / 4,
        getHeight(),
        getWidth() / 40,
        getHeight() / 2
    ),
    matter.Bodies.rectangle(
        (getWidth() * 3) / 4,
        0,
        getWidth() / 40,
        getHeight() / 2
    ),
    matter.Bodies.rectangle(
        (getWidth() * 3) / 4,
        getHeight(),
        getWidth() / 40,
        getHeight() / 2
    ),
    matter.Bodies.rectangle(
        0,
        getHeight() / 4,
        getWidth() / 4,
        getHeight() / 40
    ),
    matter.Bodies.rectangle(
        getWidth(),
        getHeight() / 4,
        getWidth() / 4,
        getHeight() / 40
    ),
    matter.Bodies.rectangle(
        0,
        (getHeight() * 3) / 4,
        getWidth() / 4,
        getHeight() / 40
    ),
    matter.Bodies.rectangle(
        getWidth(),
        (getHeight() * 3) / 4,
        getWidth() / 4,
        getHeight() / 40
    ),
]);

export default map1;
