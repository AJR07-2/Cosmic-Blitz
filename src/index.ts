import { Application, Assets, Sprite } from "pixi.js";

const app = new Application<HTMLCanvasElement>();
app.resizeTo = window;
app.resize();
document.body.appendChild(app.view);
