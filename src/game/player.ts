import colours from "../constants/colour";
import playerConstants from "../constants/player";
import * as matter from "matter-js";

const SIZE = 50,
    MAX_VEL = 3,
    SHOT_DELAY = 2,
    ROTATE_FACTOR = 0.075,
    PROJECTILE_VEL = 20;

export interface PlayerExport {
    player: any;
    modifiers: any[];
    lastShot: {
        time: number;
        isShooting: boolean;
    };
}

export default class Player {
    id: number;
    dead = false;
    score: number = 0;
    projectiles: number[] = [];

    engine: any = null;
    runner: any = null;

    states: PlayerExport[] = [];
    backTimeStart: number = 0;
    bar: any = null;

    player: any = null;
    modifiers: any[] = [];
    lastShot = {
        time: 0,
        isShooting: false,
    };

    rotating = false;

    constructor(id: number) {
        this.id = id;

        setInterval(() => {
            if (this.dead || this.backTimeStart != 0 || this.player === null)
                return;
            this.states.push(this.export());
            if (this.states.length > 60) this.states.shift();
        }, 1000 / 6);
    }

    createBody(runner: any, engine: any) {
        this.engine = engine;
        this.runner = runner;
        const world = engine.world;

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
            ],
            {
                label: "player",
                render: {
                    fillStyle: "#" + playerConstants[this.id - 1].colour,
                    zIndex: 1,
                },
                frictionAir: 0,
            }
        );
        matter.Body.rotate(this.player, playerConstants[this.id - 1].rotate);

        // check projectile hit
        matter.Events.on(engine, "collisionStart", (e: any) => {
            for (let pair of e.pairs) {
                if (
                    pair.bodyA.label == "projectile" &&
                    pair.bodyB.label == "player" &&
                    pair.bodyB.id == this.player.id &&
                    !this.projectiles.includes(pair.bodyA.id)
                ) {
                    matter.World.remove(world, this.player);
                    this.dead = true;
                } else if (
                    pair.bodyB.label == "projectile" &&
                    pair.bodyA.label == "player" &&
                    pair.bodyA.id == this.player.id &&
                    !this.projectiles.includes(pair.bodyB.id)
                ) {
                    matter.World.remove(world, this.player);
                    this.dead = true;
                }
            }
        });

        // key listeners
        document.addEventListener("keydown", (e) => {
            if (e.key == playerConstants[this.id - 1].keys.rotate) {
                this.rotating = true;
            } else if (e.key == playerConstants[this.id - 1].keys.shoot) {
                this.lastShot.isShooting = true;
            } else if (
                e.key == playerConstants[this.id - 1].keys.backspace &&
                this.backTimeStart == 0
            ) {
                this.backTimeStart = new Date().getTime();
                matter.Sleeping.set(this.player, true);
                // add a bar at the player's location
                this.bar = matter.Bodies.rectangle(
                    this.player.position.x,
                    this.player.position.y,
                    5,
                    10,
                    {
                        isStatic: true,
                        render: {
                            fillStyle:
                                "#" + playerConstants[this.id - 1].colour,
                        },
                        collisionFilter: {
                            group: 1,
                            mask: 0,
                        },
                    }
                );
                matter.World.add(world, this.bar);
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.key == playerConstants[this.id - 1].keys.rotate) {
                this.rotating = false;
            } else if (e.key == playerConstants[this.id - 1].keys.shoot) {
                this.lastShot.isShooting = false;
            } else if (e.key == playerConstants[this.id - 1].keys.backspace) {
                matter.World.remove(world, this.bar);
                let newTime = new Date().getTime();
                let time = Math.floor(
                    Math.min(10, (newTime - this.backTimeStart) / 1000) * 10
                );
                this.load(
                    this.states[Math.max(0, this.states.length - time - 1)]
                );
                this.backTimeStart = 0;
                matter.Sleeping.set(this.player, false);
            }
        });

        // on game tick
        matter.Events.on(runner, "tick", () => {
            if (this.dead) return;

            // if there's a bar, lengthen it
            let time = (new Date().getTime() - this.backTimeStart) / 1000;
            if (this.bar !== null && time < 10) {
                matter.Body.setVertices(this.bar, [
                    { x: -time * 5, y: 10 },
                    { x: time * 5, y: 10 },
                    { x: time * 5, y: -10 },
                    { x: -time * 5, y: -10 },
                ]);
            }

            // create particles
            if (Math.random() < 0.3) {
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
                    x: Math.random() * 1 - 0.5,
                    y: Math.random() * 1 - 0.5,
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

            // acceleration from thrusters in the player's direction
            let rotation = this.player.angle;
            matter.Body.applyForce(
                this.player,
                this.player.position,
                matter.Vector.create(
                    Math.cos(rotation) * 0.0005,
                    Math.sin(rotation) * 0.0005
                )
            );

            // clamp velocity if at border
            if (
                this.player.position.x <= SIZE ||
                this.player.position.y >= window.innerHeight - SIZE ||
                this.player.position.x >= window.innerWidth - SIZE ||
                this.player.position.y <= SIZE
            ) {
                matter.Body.setVelocity(this.player, {
                    x: 0,
                    y: 0,
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

        // on projectiles collide
        matter.Events.on(engine, "collisionStart", (e: any) => {
            for (let pair of e.pairs) {
                if (
                    pair.bodyA.label == "projectile" &&
                    this.projectiles.includes(pair.bodyA.id) &&
                    pair.bodyB.id != this.player.id
                ) {
                    this.projectiles.splice(
                        this.projectiles.indexOf(pair.bodyA.id),
                        1
                    );
                    matter.Composite.remove(world, pair.bodyA);
                    if (pair.bodyB.label == "player") {
                        this.score++;
                    }
                } else if (
                    pair.bodyB.label == "projectile" &&
                    this.projectiles.includes(pair.bodyB.id) &&
                    pair.bodyA.id != this.player.id
                ) {
                    this.projectiles.splice(
                        this.projectiles.indexOf(pair.bodyB.id),
                        1
                    );
                    matter.Composite.remove(world, pair.bodyB);
                    if (pair.bodyB.label == "player") {
                        this.score++;
                    }
                }
            }
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
                        render: {
                            fillStyle: "#" + colours.error,
                        },
                        friction: 0,
                        frictionAir: 0.0001,
                        label: "projectile",
                    }
                );
                matter.Body.setVelocity(projectile, {
                    x: Math.cos(this.player.angle) * PROJECTILE_VEL,
                    y: Math.sin(this.player.angle) * PROJECTILE_VEL,
                });
                matter.Composite.add(world, projectile);
                this.projectiles.push(projectile.id);
            }
        }
    }

    export() {
        return structuredClone({
            player: this.player,
            modifiers: this.modifiers,
            lastShot: this.lastShot,
        } as PlayerExport);
    }

    load(playerData: PlayerExport) {
        matter.World.remove(this.engine.world, this.player);
        this.player = playerData.player;
        matter.World.add(this.engine.world, this.player);

        this.modifiers = playerData.modifiers;
        this.lastShot = playerData.lastShot;
    }
}
