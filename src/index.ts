import { settings } from "pixi.js";
import Engine from "./game";

settings.ROUND_PIXELS = true;

let engine: Engine = new Engine();
export default engine;
