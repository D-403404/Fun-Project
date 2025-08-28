// This is a test game using Phaser, based on https://viblo.asia/p/tim-hieu-ve-phaser-Az45bNa65xY

import React from "react";
import Phaser from "phaser";
import { addBodyBorder } from "../utils/commonUtils";

const BreakoutGame = () => {
    let config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0 },
                debug: false,
            },
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        },
    };

    let game = new Phaser.Game(config);
    let bg, bricks, paddle, ball;
    let increaseSpeed = 0;

    let cursors,
        gameOver = false;
    let score = 0,
        lives = 3;
    let livesText, scoreText, introText;
    let ballOnPaddle = true;

    function preload() {
        this.load.image("brick", "/games/breakout/brick.png");
        this.load.image("ball", "/games/breakout/ball.png");
        this.load.image("paddle", "/games/breakout/paddle_big.png");
        this.load.image("starfield", "/games/breakout/starfield.jpg");
    }

    function create() {
        // console.log(this);

        // Starfield
        bg = this.add.image(0, 0, "starfield").setOrigin(0);
        bg.setScale(
            Math.max(config.width / bg.width, config.height / bg.height)
        );

        // Bricks
        bricks = createBricks(this);

        // Paddle
        paddle = this.physics.add
            .sprite(config.width / 2, config.height - 100, "paddle")
            .setScale(0.03, 0.01);
        paddle.setCollideWorldBounds(true);
        paddle.setBounce(1);
        paddle.setImmovable(true);
        // paddle.setPushable(true);

        cursors = this.input.keyboard.createCursorKeys();

        // Ball
        ball = this.physics.add
            .sprite(paddle.x, paddle.y - paddle.displayHeight - 16, "ball")
            .setScale(0.02);
        ball.setCollideWorldBounds(true);
        ball.body.onWorldBounds = true;
        ball.setBounce(1);

        // ball.animations.add(
        //     "spin",
        //     [
        //         "ball_1.png",
        //         "ball_2.png",
        //         "ball_3.png",
        //         "ball_4.png",
        //         "ball_5.png",
        //     ],
        //     50,
        //     true,
        //     false
        // );

        // Text
        livesText = this.add
            .text(config.width - 16, 16, "lives: 3", {
                fontFamily: "Pixelify Sans",
                fontSize: "18px",
                fill: "#ffffff",
            })
            .setOrigin(1, 0);
        scoreText = this.add
            .text(16, 16, "score: 0", {
                fontFamily: "Pixelify Sans",
                fontSize: "18px",
                fill: "#ffffff",
            })
            .setOrigin(0);
        introText = this.add
            .text(config.width / 2, config.height / 2, "- Space to Start -", {
                fontFamily: "Pixelify Sans",
                fontSize: "24px",
                fill: "#ffffff",
            })
            .setOrigin(0.5);

        this.physics.world.on("worldbounds", (body, up, down, left, right) => {
            if (body.gameObject === ball && down) {
                ballLost(this);
            }
        });

        this.physics.add.collider(ball, paddle, ballHitPaddle, null, this);
        this.physics.add.collider(ball, bricks, ballHitBrick, null, this);
    }

    function update() {
        if (gameOver) return;

        ball.setAngle(ball.angle + 10);

        if (cursors.left.isDown) {
            // paddle.setVelocityX(-300);
            paddle.setX(paddle.x - 10);
        } else if (cursors.right.isDown) {
            // paddle.setVelocityX(300);
            paddle.setX(paddle.x + 10);
        }

        if (paddle.x < paddle.displayWidth / 2 + 10) {
            paddle.setX(paddle.displayWidth / 2 + 10);
        } else if (paddle.x > config.width - (paddle.displayWidth / 2 + 10)) {
            paddle.setX(config.width - (paddle.displayWidth / 2 + 10));
        }

        if (ballOnPaddle) {
            ball.setX(paddle.x);
            ball.disableBody(true, false);
            if (cursors.space.isDown) {
                releaseBall();
            }
        }
    }

    function createBricks(scene) {
        const rows = 5;
        const cols = 10;

        const marginTop = 50;
        const marginSide = 50;
        const availableWidth = config.width - marginSide * 2;
        const spacingX = 0;
        const spacingY = 20;

        const brickWidth = availableWidth / cols - spacingX;
        const brickHeight = 32;

        const bricks = scene.physics.add.group();

        for (let y = 0; y < rows; y++) {
            bricks
                .createMultiple({
                    key: "brick",
                    repeat: cols - 1,
                    setXY: {
                        x: marginSide + brickWidth / 2,
                        y:
                            marginTop -
                            spacingY / 2 +
                            y * (spacingY + brickHeight) +
                            spacingY / 2 +
                            brickHeight / 2,
                        stepX: brickWidth + spacingX * 2,
                    },
                })
                .forEach((brick) => {
                    brick.setScale(
                        brickWidth / brick.width,
                        brickHeight / brick.height
                    );
                    brick.setImmovable(true);
                    // addBodyBorder(scene, brick.body, 0x00ff00, 1);
                });
        }

        return bricks;
    }

    function releaseBall() {
        if (ballOnPaddle) {
            ballOnPaddle = false;
            ball.enableBody(false, 0, 0, true, true);
            ball.setVelocityY(-300);
            ball.setVelocityX(Phaser.Math.Between(-100, 100));
            // ball.animations.play("spin");
            introText.setVisible(false);
        }
    }

    function ballHitPaddle(_ball, _paddle) {
        let diff = 0;

        if (_ball.x < _paddle.x) {
            //  Ball is on the left-hand side of the paddle
            diff = _paddle.x - _ball.x;
            _ball.setVelocityX(-5 * diff);
        } else if (_ball.x > _paddle.x) {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x - _paddle.x;
            _ball.setVelocityX(5 * diff);
        } else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    function ballHitBrick(_ball, _brick) {
        _brick.disableBody(true, true);
        score += 10;
        scoreText.setText("score: " + score);

        increaseSpeed += 1;
        _ball.setVelocityY(
            _ball.body.velocity.y +
                Math.sign(_ball.body.velocity.y) * increaseSpeed
        );

        if (bricks.countActive() == 0) {
            score += 1000;
            scoreText.setText("score: " + score);
            introText.setText("- Next Level -");

            ballOnPaddle = true;
            ball.setVelocityX(0);
            ball.setVelocityY(0);
            ball.enableBody(
                true,
                paddle.x,
                paddle.y - paddle.displayHeight - 16,
                true,
                true
            );
            // ball.animations.stop();

            bricks.children.iterate((child) => {
                child.enableBody(true, child.x, child.y, true, true);
            });
        }
    }

    function ballLost(scene) {
        lives--;
        livesText.setText("lives: " + lives);

        if (lives === 0) {
            scene.physics.pause();
            introText.setText("Game Over. Your score: " + score);
            introText.setVisible(true);
            gameOver = true;
        } else {
            ballOnPaddle = true;

            ball.enableBody(
                true,
                paddle.x + 16,
                paddle.y - paddle.displayHeight - 16,
                true,
                true
            );

            // ball.animations.stop();
        }
    }

    return <div>BreakoutGame</div>;
};

export default BreakoutGame;
