import { PlayerExport } from "../game/player";

export default interface Game {
    map: number;
    players: PlayerExport[];
}
