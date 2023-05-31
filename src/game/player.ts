import Coordinates from "../utils/coordinates";
import Modifier from "./modifier";
import Projectile from "./projectile";

export interface PlayerExport {
    coords: Coordinates;
    rotation: number;
    modifiers: Modifier[];
    projectiles: Projectile[];
}

export default class Player {
    id: number;
    coords: Coordinates;
    rotation: number = 0;

    states: PlayerExport[] = [];
    modifiers: Modifier[] = [];
    projectiles: Projectile[] = [];

    constructor(id: number) {
        this.id = id;
        this.coords = new Coordinates(
            this.id == 0 || this.id == 2 ? 0 : window.innerWidth,
            this.id == 0 || this.id == 1 ? 0 : window.innerHeight
        );

        setInterval(() => {
            this.states.push(this.export());
            if (this.states.length > 60) this.states.shift();
        }, 1000 / 6);
    }

    export() {
        return {
            coords: this.coords,
            rotation: this.rotation,
            modifiers: this.modifiers,
            projectiles: this.projectiles,
        } as PlayerExport;
    }

    load(playerData: PlayerExport) {
        this.coords = playerData.coords;
        this.rotation = playerData.rotation;
        this.modifiers = playerData.modifiers;
        this.projectiles = playerData.projectiles;
    }
}
