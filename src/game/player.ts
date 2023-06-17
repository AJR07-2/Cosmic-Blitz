import playerConstants from "../constants/player";
import Modifier from "./gameplay/modifiers/modifier";
import Projectile from "./gameplay/projectile";
import * as matter from "matter-js";

const SIZE = 50,
    MAX_VEL = 3,
    BOUNCE_FACTOR = 1.1;

export interface PlayerExport {
    modifiers: Modifier[];
    projectiles: Projectile[];
}

export default class Player {
    id: number;
    player: any = null;

    states: PlayerExport[] = [];
    modifiers: Modifier[] = [];
    projectiles: Projectile[] = [];

    constructor(id: number) {
        this.id = id;

        setInterval(() => {
            this.states.push(this.export());
            if (this.states.length > 60) this.states.shift();
        }, 1000 / 6);
    }

    createPlayer(runner: any) {
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
                { x: 0, y: SIZE },
                { x: SIZE, y: SIZE / 2 },
            ]
        );
        this.player.render.fillStyle =
            "#" + playerConstants[this.id - 1].colour;
        matter.Body.rotate(this.player, playerConstants[this.id - 1].rotate);

        // on game tick
        matter.Events.on(runner, "tick", () => {
            // clamp to world border
            matter.Body.setPosition(this.player, {
                x: Math.min(
                    Math.max(this.player.position.x, SIZE),
                    window.innerWidth - SIZE
                ),
                y: Math.min(
                    Math.max(this.player.position.y, SIZE),
                    window.innerHeight - SIZE
                ),
            });

            // acceleration from thrusters in the rotation of the player
            let rotation = this.player.angle;
            matter.Body.applyForce(
                this.player,
                this.player.position,
                matter.Vector.create(
                    Math.cos(rotation) * 0.0005,
                    Math.sin(rotation) * 0.0005
                )
            );

            // bounce off world border
            if (
                this.player.position.x <= SIZE ||
                this.player.position.y >= window.innerHeight - SIZE ||
                this.player.position.x >= window.innerWidth - SIZE ||
                this.player.position.y <= SIZE
            ) {
                matter.Body.setVelocity(this.player, {
                    x: -this.player.velocity.x * BOUNCE_FACTOR,
                    y: -this.player.velocity.y * BOUNCE_FACTOR,
                });
            }

            // clamp velocity
            matter.Body.setVelocity(this.player, {
                x: Math.min(
                    Math.max(this.player.velocity.x, -MAX_VEL),
                    MAX_VEL
                ),
                y: Math.min(
                    Math.max(this.player.velocity.y, -MAX_VEL),
                    MAX_VEL
                ),
            });
        });
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
