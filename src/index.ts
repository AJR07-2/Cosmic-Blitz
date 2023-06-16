import { settings } from "pixi.js";
import AppEngine from "./game";

settings.ROUND_PIXELS = true;

let engine: AppEngine = new AppEngine();
export default engine;
