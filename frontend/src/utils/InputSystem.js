export default class InputSystem{
    constructor(scene){
        this.keys = scene.input.keyboard.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D",
            space: "SPACE",
        });

        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    moveUp() { return this.keys.up.isDown || this.cursors.up.isDown; }
    moveDown() { return this.keys.down.isDown || this.cursors.down.isDown; }
    moveRight() { return this.keys.right.isDown || this.cursors.right.isDown; }
    moveLeft() { return this.keys.left.isDown || this.cursors.left.isDown; }
    playAttack() { return this.keys.space.isDown; }
}