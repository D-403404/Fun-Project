import React from "react";
import { useNavigate } from "react-router-dom";
import Phaser from "phaser";

import { addBodyBorder } from "@/utils/gameUtils";

const ChromeDinoGame = () => {
    const navigate = useNavigate();
    const WIDTH = 3200;

    const colorChromeDinoGrey = window
            .getComputedStyle(document.body)
            .getPropertyValue("--color-chrome-dino-grey"),
        colorChromeDinoWhite = window
            .getComputedStyle(document.body)
            .getPropertyValue("--color-chrome-dino-white");

    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        parent: "game-container",
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 1000 },
                debug: false,
            },
        },
        backgroundColor: colorChromeDinoWhite,
        scene: {
            preload: preload,
            create: create,
            update: update,
        },
    };

    React.useEffect(() => {
        let game = new Phaser.Game(config);
    }, []);

    const defaultSpeed = 300;
    let speed = defaultSpeed;

    let base, ground, sun, mountains, cacti, car, spaceship, dino;
    const cactusSprites = [
        { key: "cacti-small", frames: 6 },
        { key: "cacti-large", frames: 2 },
        { key: "cacti-group", frames: 1 },
    ];
    let titleText, spaceshipText, carText, instructionText;

    const titleStyle = {
            fontFamily: "Pixelify Sans",
            fontSize: "80px",
            fontWeight: "bold",
            color: colorChromeDinoWhite,
            stroke: colorChromeDinoGrey,
            strokeThickness: 8,
        },
        normalStyle = {
            fontFamily: "Pixelify Sans",
            fontSize: "32px",
            color: colorChromeDinoWhite,
            stroke: colorChromeDinoGrey,
            strokeThickness: 6,
        };
    let cursors;

    let idleAnim, titleTween, instructionTween;
    const titleTweenConfig = {
            alpha: { from: 0, to: 1 },
            y: { from: config.height / 2 - 120, to: config.height / 2 - 80 },
            scale: { from: 0.8, to: 1.0 },
            duration: 2000,
            ease: "Sine.easeInOut",
        },
        instructionTweenConfig = {
            alpha: { from: 1, to: 0 },
            duration: 1000,
            ease: "Sine.easeInOut",
        },
        textFloatingTweenConfig = {
            // Set y-position when using this config
            duration: 1000,
            yoyo: true,
            ease: "Cubic.easeOut",
            repeat: -1,
        };

    let keys;
    let delayed = null,
        interactedWith = null;
    const triggerEvents = [
        {
            x: 500,
            callback: (scene) => {
                console.log("Title appears");
                instructionTween.restart();
                scene.time.delayedCall(1000, () => {
                    titleTween.restart();
                });
            },
            triggered: false,
        },
    ];

    function preload() {
        this.load.image("ground", "/games/chrome-dino/ground.png");
        this.load.image("sun", "/games/chrome-dino/sun.png");
        this.load.spritesheet("dino", "/games/chrome-dino/dino.png", {
            frameWidth: 88,
            frameHeight: 94,
        });
        this.load.spritesheet(
            "dino-crawl",
            "/games/chrome-dino/dino-crawl.png",
            {
                frameWidth: 118,
                frameHeight: 60,
            }
        );
        this.load.spritesheet(
            "cacti-small",
            "/games/chrome-dino/cacti-small.png",
            {
                frameWidth: 34,
                frameHeight: 70,
            }
        );
        this.load.spritesheet(
            "cacti-large",
            "/games/chrome-dino/cacti-large.png",
            {
                frameWidth: 49,
                frameHeight: 100,
            }
        );
        this.load.spritesheet(
            "cacti-group",
            "/games/chrome-dino/cacti-group.png",
            {
                frameWidth: 200,
                frameHeight: 100,
            }
        );
        this.load.image("mountains", "/games/chrome-dino/mountains.png");
        this.load.image("car", "/games/chrome-dino/car.png");
        this.load.image("spaceship", "/games/chrome-dino/spaceship.png");
        this.load.image(
            "spaceship-fly",
            "/games/chrome-dino/spaceship-fly.png"
        );
    }

    function create() {
        base = this.add
            .rectangle(
                0,
                config.height,
                config.width,
                config.height / 15,
                parseInt(colorChromeDinoWhite.replace("#", "0x"), 16)
            )
            .setOrigin(0, 1)
            .setDepth(1)
            .setScrollFactor(0);

        ground = this.physics.add
            .sprite(0, config.height - base.height, "ground")
            .setOrigin(0, 0);
        ground.setImmovable(true);
        ground.body.allowGravity = false;
        ground.setOffset(0, 25);
        ground.setScale(WIDTH / ground.width, 1);
        ground.setDepth(1);

        this.add
            .image((config.width * 4) / 5, config.height / 3, "sun")
            .setScale(2)
            .setScrollFactor(0.01);
        // createSun(this);

        createMountains(this, 2);

        createCacti(this, 15);
        cacti.setDepth(2);
        this.physics.add.collider(ground, cacti);

        spaceship = this.physics.add
            .sprite(WIDTH - (config.width * 2) / 3, ground.y + 25, "spaceship")
            .setOrigin(0.5, 1)
            .setDepth(3)
            .setScale(0.3);
        this.physics.add.collider(ground, spaceship);

        car = this.physics.add
            .sprite(WIDTH - config.width / 3, ground.y + 25, "car")
            .setOrigin(0.5, 1)
            .setDepth(3)
            .setScale(1.2);
        this.physics.add.collider(ground, car);

        createDino(this);
        dino.setDepth(4);
        this.physics.add.collider(ground, dino);

        // Overlap
        this.physics.add.overlap(dino, spaceship, overlapSpaceship, null, this);
        this.physics.add.overlap(dino, car, overlapCar, null, this);

        // Text
        createTexts(this);

        // Control
        keys = this.input.keyboard.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D",
            enter: "ENTER",
            space: "SPACE",
        });
        cursors = this.input.keyboard.createCursorKeys();

        dino.on("animationrepeat", (anim) => {
            if (anim.key !== "idle") return;
            idleAnim.frames[0].duration = Phaser.Math.Between(2000, 5000);
        });

        this.tweens.add({
            ...textFloatingTweenConfig,
            targets: spaceshipText,
            y: { from: spaceshipText.y, to: spaceshipText.y - 20 },
        });
        this.tweens.add({
            ...textFloatingTweenConfig,
            targets: carText,
            y: { from: carText.y, to: carText.y - 20 },
        });

        addBorders(this);

        // World settings
        this.cameras.main.setBounds(0, 0, WIDTH, config.height);
        this.physics.world.setBounds(0, 0, WIDTH, config.height);
        this.cameras.main.startFollow(dino);
        this.cameras.main.followOffset.set(-300, 0);
    }

    function update() {
        if (!interactedWith) {
            if (keys.left.isDown || cursors.left.isDown) {
                dino.setVelocityX(-speed);
                dino.setFlipX(true);
            } else if (keys.right.isDown || cursors.right.isDown) {
                dino.setVelocityX(speed);
                dino.setFlipX(false);
            } else {
                dino.setVelocityX(0);
            }

            if (
                (keys.up.isDown || cursors.up.isDown || cursors.space.isDown) &&
                dino.body.onFloor()
            ) {
                dino.setVelocityY(-400);
            }

            if (keys.down.isDown || cursors.down.isDown) {
                speed = defaultSpeed * 2;
                dino.anims.play("crawl", true); // Must place this line above setSize to change sprite before setting the size
                dino.setSize(dino.width, dino.height);
            } else {
                speed = defaultSpeed;
                dino.setSize(dino.width, dino.height);

                if (
                    keys.left.isDown ||
                    cursors.left.isDown ||
                    keys.right.isDown ||
                    cursors.right.isDown
                ) {
                    dino.anims.play("run", true);
                } else {
                    dino.anims.play("idle", true);
                }
            }

            triggerEvents.forEach((e) => {
                if (!e.triggered && dino.x >= e.x) {
                    e.triggered = true;
                    e.callback(this);
                }
            });
        } else if (interactedWith === car) {
            dino.setX(car.x - 20);
            dino.setY(car.y - 10);
        }

        // Instant redirect
        if (
            delayed &&
            (keys.enter.isDown || keys.up.isDown || cursors.up.isDown)
        ) {
            console.log("Redirecting...");
            delayed.remove(false);
            delayed.callback.apply(this, delayed.args);
        }
    }

    function addBorders(scene) {
        addBodyBorder(scene, dino.body, 0x00ff00, 1);
        addBodyBorder(scene, ground.body, 0x00ff00, 1);
        addBodyBorder(scene, car.body, 0x0000ff, 1);
        addBodyBorder(scene, spaceship.body, 0x0000ff, 1);
        cacti.getChildren().forEach((cactus) => {
            addBodyBorder(scene, cactus.body, 0xff0000, 1);
        });
    }

    function createTexts(scene) {
        titleText = scene.add
            .text(
                config.width / 2,
                config.height / 2 - 100,
                "Fun Project",
                titleStyle
            )
            .setAlpha(0)
            .setOrigin(0.5);
        titleText.setScrollFactor(0);

        instructionText = scene.add
            .text(
                config.width / 2,
                config.height / 2 - 100,
                "Press UP/W/SPACE to jump, DOWN/S to run, LEFT/A and RIGHT/D to move, UP/ENTER to select",
                {
                    ...normalStyle,
                    fontSize: "24px",
                    wordWrap: { width: config.width - 100 },
                    align: "center",
                }
            )
            .setAlpha(1)
            .setOrigin(0.5);

        spaceshipText = scene.add
            .text(
                spaceship.x,
                spaceship.y - spaceship.displayHeight - 50,
                "To Login",
                normalStyle
            )
            .setOrigin(0.5);

        carText = scene.add
            .text(
                car.x,
                car.y - car.displayHeight - 50,
                "To Register",
                normalStyle
            )
            .setOrigin(0.5);

        // Text tweens
        titleTween = scene.tweens.create({
            ...titleTweenConfig,
            targets: titleText,
        });
        instructionTween = scene.tweens.create({
            ...instructionTweenConfig,
            targets: instructionText,
        });
    }

    function createSun(scene) {
        sun = scene.add.container();

        // let outerGlow = scene.add
        //     .circle(
        //         (config.width * 4) / 5,
        //         config.height / 3,
        //         30,
        //         parseInt(colorChromeDinoGrey.replace("#", "0x"), 16)
        //     )
        //     .setScrollFactor(0);
        // outerGlow.postFX.addBlur(0, 7, 7, 5);
        let innerGlow = scene.add
            .circle(
                (config.width * 4) / 5,
                config.height / 3,
                30,
                parseInt(colorChromeDinoGrey.replace("#", "0x"), 16)
            )
            .setScrollFactor(0);
        innerGlow.postFX.addBlur(0, 5, 5, 3);
        let center = scene.add
            .circle(
                (config.width * 4) / 5,
                config.height / 3,
                20,
                parseInt(colorChromeDinoGrey.replace("#", "0x"), 16)
            )
            .setScrollFactor(0);
        center.postFX.addBlur(0, 1, 1, 0.5);

        sun.add(innerGlow, center);
    }

    function createMountains(scene, number) {
        mountains = scene.physics.add.staticGroup();
        const textureWidth = scene.textures
            .get("mountains")
            .getSourceImage().width;

        // Create layers from back to front
        for (let i = 0; i < number; i++) {
            let scaleFactor = 2 * Math.exp(1 * (i - number + 1));
            let scrollFactor = 1 - (number - i) * 0.2;
            let mountainLayer = scene.physics.add.staticGroup();
            mountainLayer.createMultiple({
                key: "mountains",
                repeat: Math.ceil(WIDTH / (textureWidth * scaleFactor)),
                setXY: {
                    x: 0,
                    // y: ground.y + 200 - (number - 1 - i) * 200,
                    y: ground.y - 200 + 400 * Math.exp(1 * (i - number + 1)),
                    stepX: textureWidth * scaleFactor,
                },
            });
            mountainLayer.children.iterate((mountain) => {
                mountain
                    .setOrigin(0, 1)
                    .setScale(scaleFactor)
                    .setScrollFactor(scrollFactor)
                    .refreshBody();
            });
            mountains.add(mountainLayer);
        }
    }

    function createCacti(scene, number) {
        cacti = scene.physics.add.staticGroup();
        for (let i = 0; i < number; i++) {
            let sheet = cactusSprites[Phaser.Math.Between(0, 2)];
            cacti
                .create(
                    Phaser.Math.FloatBetween(150, WIDTH - 300),
                    ground.y + 15,
                    sheet.key,
                    Phaser.Math.Between(0, sheet.frames - 1)
                )
                .setOrigin(0, 1)
                .refreshBody();
        }
    }

    function createDino(scene) {
        dino = scene.physics.add.sprite(100, 450, "dino").setOrigin(0.5, 1);
        dino.setCollideWorldBounds(true);

        idleAnim = scene.anims.create({
            key: "idle",
            frames: [
                {
                    key: "dino",
                    frame: 0,
                    duration: Phaser.Math.Between(2000, 5000),
                },
                { key: "dino", frame: 1, duration: 100 },
            ],
            frameRate: 1,
            repeat: -1,
        });

        scene.anims.create({
            key: "run",
            frames: scene.anims.generateFrameNumbers("dino", {
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        scene.anims.create({
            key: "crawl",
            frames: scene.anims.generateFrameNumbers("dino-crawl", {
                start: 0,
                end: 1,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    function overlapSpaceship(dino, spaceship) {
        if (keys.enter.isDown || keys.up.isDown || cursors.up.isDown) {
            interactedWith = spaceship;

            spaceship.setTexture("spaceship-fly");
            dino.disableBody(true, true);
            spaceship.setAccelerationY(-1200);

            let temp = this.time.delayedCall(4000, () => {
                delayed = null;
                console.log("login");
                navigate("/login");
                window.location.reload();
                // window.location.href = "/login";
            });
            this.time.delayedCall(500, () => (delayed = temp));
        }
    }

    function overlapCar(dino, car) {
        if (keys.enter.isDown || keys.up.isDown || cursors.up.isDown) {
            interactedWith = car;

            dino.disableBody(true, false);
            dino.setTexture("dino");
            dino.setFlipX(false);
            dino.setCrop(0, 0, dino.displayWidth, dino.displayHeight / 3 - 5);

            car.setAccelerationX(200);
            car.setVelocityX(50);

            let temp = this.time.delayedCall(3000, () => {
                delayed = null;
                console.log("register");
                navigate("/register");
                window.location.reload();
                // window.location.href = "/register";
            });
            this.time.delayedCall(500, () => (delayed = temp));
        }
    }

    return <div></div>;
};

export default ChromeDinoGame;
