// This is a test game using Phaser, based on https://viblo.asia/p/tim-hieu-ve-phaser-Az45bNa65xY

import Phaser from "phaser";

let config = {
    type: Phaser.AUTO,
    width: window.width,
    height: window.height,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

let game = new Phaser.Game(config);
let s, bricks, paddle, ball;

let score = 0, lives = 3;
let livesText = {text: "", visible: true};
let scoreText = {text: "", visible: true};
let introText = {text: "", visible: true};

let ballOnPaddle = false;

function preload() {
    game.load.atlas(
        "breakout",
        "/games/breakout/breakout.png",
        "/games/breakout/breakout.json"
    );
    game.load.image("starfield", "assets/misc/starfield.jpg");
}

function create() {
    // Starfield
    s = game.add.tileSprite(0, 0, 800, 600, "starfield");

    // Bricks
    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;

    let brick;

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 15; x++) {
            brick = bricks.create(
                120 + x * 36,
                100 + y * 52,
                "breakout",
                "brick_" + (y + 1) + "_1.png"
            );
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }

    // Paddle
    paddle = game.add.sprite(
        game.world.centerX,
        500,
        "breakout",
        "paddle_big.png"
    );
    paddle.anchor.setTo(0.5, 0.5);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    // Ball
    ball = game.add.sprite(
        game.world.centerX,
        paddle.y - 16,
        "breakout",
        "ball_1.png"
    );
    ball.anchor.set(0.5);
    ball.checkWorldBounds = true;
    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    ball.animations.add(
        "spin",
        ["ball_1.png", "ball_2.png", "ball_3.png", "ball_4.png", "ball_5.png"],
        50,
        true,
        false
    );

    ball.events.onOutOfBounds.add(ballLost, this);

    function ballLost() {
        lives--;
        livesText.text = "lives: " + lives;

        if (lives === 0) {
            alert("Game Over. Your score: " + score);
        } else {
            ballOnPaddle = true;

            ball.reset(paddle.body.x + 16, paddle.y - 16);

            ball.animations.stop();
        }
    }

    game.input.onDown.add(releaseBall, this);
    function releaseBall() {
        if (ballOnPaddle) {
            ballOnPaddle = false;
            ball.body.velocity.y = -300;
            ball.body.velocity.x = -75;
            ball.animations.play("spin");
            introText.visible = false;
        }
    }
}

function update() {
    paddle.x = game.input.x;
    if (paddle.x < 24) {
        paddle.x = 24;
    } else if (paddle.x > game.width - 24) {
        paddle.x = game.width - 24;
    }

    if (ballOnPaddle) {
        ball.body.x = paddle.x;
    } else {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
    }
}

game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
function ballHitBrick(_ball, _brick) {
    _brick.kill();
    score += 10;
    scoreText.text = "score: " + score;

    if (bricks.countLiving() == 0) {
        score += 1000;
        scoreText.text = "score: " + score;
        introText.text = "- Next Level -";

        ballOnPaddle = true;
        ball.body.velocity.set(0);
        ball.x = paddle.x + 16;
        ball.y = paddle.y - 16;
        ball.animations.stop();

        bricks.callAll("revive");
    }
}
