// This is a test game using Phaser, based on https://viblo.asia/p/tim-hieu-ve-phaser-Az45bNa65xY

import React from "react";
import Phaser from "phaser";

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
    let bricks, paddle, ball;

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
        this.add.image(400, 300, "starfield").setScale(0.5);

        // Text
        livesText = this.add.text(700, 16, "lives: 3", {
            fontSize: "18px",
            fill: "#ffffff",
        });
        scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "18px",
            fill: "#ffffff",
        });
        introText = this.add
            .text(config.width / 2, config.height / 2, "- Click to Start -", {
                fontSize: "24px",
                fill: "#ffffff",
            })
            .setOrigin(0.5);

        // Bricks
        bricks = this.physics.add.group();

        let brick;

        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 15; x++) {
                brick = bricks
                    .create(120 + x * 36, 100 + y * 52, "brick")
                    .setScale(0.01);
                brick.setBounce(1);
                brick.setImmovable(true);
            }
        }

        // Paddle
        paddle = this.physics.add
            .sprite(config.width / 2, config.height - 100, "paddle")
            .setScale(0.03, 0.01);
        paddle.setCollideWorldBounds(true);
        paddle.setBounce(1);
        paddle.setImmovable(true);

        cursors = this.input.keyboard.createCursorKeys();

        // Ball
        ball = this.physics.add
            .sprite(paddle.x, paddle.y - paddle.height * 0.01 - 16, "ball")
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

        this.physics.world.on("worldbounds", (body, up, down, left, right) => {
            if (body.gameObject === ball && down) {
                ballLost(this);
            }
        });

        this.input.keyboard.on("keydown", releaseBall, this);
    }

    function update() {
        if (gameOver) return;

        if (cursors.left.isDown) {
            paddle.setVelocityX(-300);
        } else if (cursors.right.isDown) {
            paddle.setVelocityX(300);
        } else {
            paddle.setVelocityX(0);
        }

        if (paddle.x < 50) {
            paddle.x = 50;
        } else if (paddle.x > this.width - 50) {
            paddle.x = this.width - 50;
        }

        if (ballOnPaddle) {
            ball.x = paddle.x;
        } else {
            this.physics.add.collider(ball, paddle, ballHitPaddle, null, this);
            this.physics.add.collider(ball, bricks, ballHitBrick, null, this);
        }

        this.physics.add.collider(ball, bricks, ballHitBrick, null, this);
    }

    function ballLost(scene) {
        lives--;
        livesText.setText("lives: " + lives);

        if (lives === 0) {
            scene.physics.pause();
            alert("Game Over. Your score: " + score);
            gameOver = true;
        } else {
            ballOnPaddle = true;

            ball.enableBody(
                true,
                paddle.x + 16,
                paddle.y - paddle.height * 0.01 - 16,
                true,
                true
            );

            // ball.animations.stop();
        }
    }

    function releaseBall() {
        if (ballOnPaddle) {
            ballOnPaddle = false;
            ball.setVelocityY(-300);
            ball.setVelocityX(-75);
            // ball.animations.play("spin");
            introText.setVisible(false);
        }
    }

    function ballHitPaddle(_ball, _paddle) {
        let diff = 0;

        if (_ball.x < _paddle.x) {
            //  Ball is on the left-hand side of the paddle
            diff = _paddle.x - _ball.x;
            _ball.setVelocityX(-10 * diff);
        } else if (_ball.x > _paddle.x) {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x - _paddle.x;
            _ball.setVelocityX(10 * diff);
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
                paddle.y - paddle.height * 0.01 - 16,
                true,
                true
            );
            // ball.animations.stop();

            bricks.children.iterate((child) => {
                child.enableBody(true, child.x, child.y, true, true);
            });
        }
    }

    return <div>BreakoutGame</div>;
};

export default BreakoutGame;
