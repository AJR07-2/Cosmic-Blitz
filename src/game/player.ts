import colours from "../constants/colour";
import playerConstants from "../constants/player";
import Modifier from "./modifiers/modifier";
import * as matter from "matter-js";

const SIZE = 50,
    MAX_VEL = 3,
    SHOT_DELAY = 2,
    BOUNCE_FACTOR = 1.1,
    ROTATE_FACTOR = 0.025,
    PROJECTILE_VEL = 20;

export interface PlayerExport {
    id: number;
    player: any;
    modifiers: Modifier[];
}

export default class Player {
    id: number;
    player: any = null;

    states: PlayerExport[] = [];
    modifiers: Modifier[] = [];
    projectiles: any[] = [];

    rotating = false;
    lastShot = {
        time: 0,
        isShooting: false,
    };

    constructor(id: number) {
        this.id = id;

        setInterval(() => {
            this.states.push(this.export());
            if (this.states.length > 60) this.states.shift();
        }, 1000 / 6);
    }

    createBody(runner: any, world: any) {
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
        this.player.render.zIndex = 1;
        matter.Body.rotate(this.player, playerConstants[this.id - 1].rotate);

        // key listeners
        document.addEventListener("keydown", (e) => {
            if (e.key == playerConstants[this.id - 1].keys.rotate) {
                this.rotating = true;
            } else if (e.key == playerConstants[this.id - 1].keys.shoot) {
                this.lastShot.isShooting = true;
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.key == playerConstants[this.id - 1].keys.rotate) {
                this.rotating = false;
            } else if (e.key == playerConstants[this.id - 1].keys.shoot) {
                this.lastShot.isShooting = false;
            }
        });

        // on game tick
        matter.Events.on(runner, "tick", () => {
            // create particles
            if (Math.random() < 0.1) {
                let particle = matter.Bodies.circle(
                    this.player.position.x,
                    this.player.position.y,
                    Math.random() * 3 + 1,
                    {
                        static: true,
                        collisionFilter: {
                            group: 1,
                            mask: 0,
                        },
                        render: {
                            fillStyle:
                                "#" + playerConstants[this.id - 1].colour,
                        },
                    }
                );

                matter.Body.setVelocity(particle, {
                    x: Math.random() * 0.5 - 1,
                    y: Math.random() * 0.5 - 1,
                });
                matter.Composite.add(world, particle);

                setTimeout(() => {
                    matter.Composite.remove(world, particle);
                }, 3000);
            }

            // rotate if key was pressed
            if (this.rotating) {
                matter.Body.rotate(this.player, ROTATE_FACTOR);
            }

            // fire projectiles if possible
            this.createProjectile(world);

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

    createProjectile(world: any) {
        if (this.lastShot.isShooting) {
            if (Date.now() - this.lastShot.time >= 1000 * SHOT_DELAY) {
                this.lastShot.time = Date.now();

                // fire projectile
                let projectile = matter.Bodies.circle(
                    this.player.position.x,
                    this.player.position.y,
                    5,
                    {
                        collisionFilter: {
                            group: 2,
                            mask: 0,
                        },
                        render: {
                            fillStyle: "#" + colours.warning,
                        },
                        friction: 0,
                    }
                );
                matter.Body.setVelocity(projectile, {
                    x: Math.cos(this.player.angle) * PROJECTILE_VEL,
                    y: Math.sin(this.player.angle) * PROJECTILE_VEL,
                });
                matter.Composite.add(world, projectile);
                this.projectiles.push(projectile);
            }
        }
    }

    export() {
        return {
            modifiers: this.modifiers,
            id: this.id,
            player: this.player,
        } as PlayerExport;
    }

    load(playerData: PlayerExport) {
        this.modifiers = playerData.modifiers;
        this.id = playerData.id;
        this.player = playerData.player;
    }
}
