import { playerColour } from "../colours/colour";
import Modifier from "./gameplay/modifiers/modifier";
import Projectile from "./gameplay/projectile";
import * as matter from "matter-js";

export interface PlayerExport {
    modifiers: Modifier[];
    projectiles: Projectile[];
}

export default class Player {
    id: number;
    player: any;

    states: PlayerExport[] = [];
    modifiers: Modifier[] = [];
    projectiles: Projectile[] = [];

    constructor(id: number) {
        this.id = id;

        // create triangle body
        this.player = matter.Bodies.fromVertices(
            this.id == 1 || this.id == 3
                ? (window.innerWidth * 10) / 100
                : (window.innerWidth * 90) / 100,
            this.id == 1 || this.id == 2
                ? (window.innerHeight * 10) / 100
                : (window.innerHeight * 90) / 100,
            [
                { x: 0, y: 0 },
                { x: 0, y: 50 },
                { x: 50, y: 25 },
            ]
        );
        this.player.render.fillStyle = "#" + playerColour[this.id - 1];

        setInterval(() => {
            this.states.push(this.export());
            if (this.states.length > 60) this.states.shift();
        }, 1000 / 6);
    }

    export() {
        return {
            modifiers: this.modifiers,
            projectiles: this.projectiles,
        } as PlayerExport;
    }

    load(playerData: PlayerExport) {
        this.modifiers = playerData.modifiers;
        this.projectiles = playerData.projectiles;
    }
}
