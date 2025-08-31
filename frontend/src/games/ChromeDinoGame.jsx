import React from "react";
import { useNavigate } from "react-router-dom";
import Phaser from "phaser";

import { addBodyBorder } from "@/utils/gameUtils";

const ChromeDinoGame = () => {
    const navigate = useNavigate();

    let config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: "game-container",
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 1000 },
                debug: false,
            },
        },
        backgroundColor: "0xFFFFFF",
        scene: {
            preload: preload,
            create: create,
            update: update,
        },
    };

    React.useEffect(() => {
        let game = new Phaser.Game(config);
    }, []);

    let defaultSpeed = 300;
    let speed = defaultSpeed;

    let ground, dino, cacti, car, spaceship;
    let cactusSprites = [
        { key: "cacti-small", frames: 6 },
        { key: "cacti-large", frames: 2 },
        { key: "cacti-group", frames: 1 },
    ];
    let titleText, spaceshipText, carText;
    const titleStyle = {
            fontFamily: "Pixelify Sans",
            fontSize: "80px",
            fontWeight: "bold",
            color: "#000000",
        },
        defaultStyle = {
            fontFamily: "Pixelify Sans",
            fontSize: "32px",
            color: "#000000",
        };
    let cursors;
    let idleAnim;
    let keys;
    let delayed = null;

    function preload() {
        this.load.image("ground", "/games/chrome-dino/ground.png");
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
        this.load.image("car", "/games/chrome-dino/car.png");
        this.load.image("spaceship", "/games/chrome-dino/spaceship.png");
        this.load.image(
            "spaceship-fly",
            "/games/chrome-dino/spaceship-fly.png"
        );
    }

    function create() {
        ground = this.physics.add
            .sprite(0, config.height - 50, "ground")
            .setOrigin(0, 0);
        ground.setImmovable(true);
        ground.body.allowGravity = false;
        ground.setOffset(0, 25);
        ground.setScale((config.width / ground.width) * 3, 1);

        cacti = createCacti(this, 10);
        this.physics.add.collider(ground, cacti);

        spaceship = this.physics.add
            .sprite(config.width * 1.5 - 600, ground.y + 25, "spaceship")
            .setOrigin(0, 1)
            .setScale(0.3);
        this.physics.add.collider(ground, spaceship);

        car = this.physics.add
            .sprite(config.width * 1.5 - 200, ground.y + 25, "car")
            .setOrigin(0, 1)
            .setScale(1.2);
        this.physics.add.collider(ground, car);

        dino = createDino(this);
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

        addBorders(this);

        // World settings
        this.cameras.main.setBounds(0, 0, ground.width, config.height);
        this.physics.world.setBounds(0, 0, ground.width, config.height);
        this.cameras.main.startFollow(dino);
        this.cameras.main.followOffset.set(-300, 0);
    }

    function update() {
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

        // Instant redirect
        if (
            delayed &&
            (keys.enter.isDown || keys.up.isDown || cursors.up.isDown)
        ) {
            console.log("Redirecting...");
            console.log(delayed);
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
            .setOrigin(0.5);
        // .setVisible(false);
        titleText.setShadow(2, 2, "#333333", 2, false, true);
        titleText.setScrollFactor(0);

        spaceshipText = scene.add
            .text(spaceship.x, spaceship.y - 100, "To Login", defaultStyle)
            .setVisible(false)
            .setOrigin(0.5);

        carText = scene.add
            .text(car.x, car.y - 100, "To Register", defaultStyle)
            .setVisible(false)
            .setOrigin(0.5);
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

        return dino;
    }

    function createCacti(scene, number) {
        cacti = scene.physics.add.staticGroup();
        for (let i = 0; i < number; i++) {
            let sheet = cactusSprites[Phaser.Math.Between(0, 2)];
            cacti
                .create(
                    Phaser.Math.FloatBetween(150, ground.width - 300),
                    ground.y + 15,
                    sheet.key,
                    Phaser.Math.Between(0, sheet.frames - 1)
                )
                .setOrigin(0, 1)
                .refreshBody();
        }

        return cacti;
    }

    function overlapSpaceship(dino, spaceship) {
        spaceshipText.setVisible(true);

        if (keys.enter.isDown || keys.up.isDown || cursors.up.isDown) {
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
        carText.setVisible(true);

        if (keys.enter.isDown || keys.up.isDown || cursors.up.isDown) {
            dino.disableBody(false, true);
            car.setAccelerationX(500);
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
