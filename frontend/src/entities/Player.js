import Phaser from 'phaser'
import { debugPoints } from '../utils/debug';
import { Color } from '../utils/constants';
import { BoxCollider } from '../utils/physicsUtil';
import AnimationSM from '../utils/AnimationSM';



export default class Player extends Phaser.Physics.Arcade.Sprite{
    speed=400;
    inputSystem;

    boxCollider;

    animator;
    hp=10;  // health point

    constructor(scene, position, texture, spriteOrigin={x: 0.5, y: 0.5}, colliderData=null){
        super(scene, position.x, position.y, texture);
        this.scene = scene;

        // Add this object to the scene and apply physics as well
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.boxCollider = new BoxCollider(this);
        this.animator = new AnimationSM(this);

        // debugPoints(scene.debugGraphics, this.x - this.width, this.y - this.height, Color.LIME, 4);
        // debugPoints(scene.debugGraphics, this.x - this.width, this.y + this.height, Color.LIME, 4);
        // debugPoints(scene.debugGraphics, this.x + this.width, this.y - this.height, Color.LIME, 4);
        // debugPoints(scene.debugGraphics, this.x + this.width, this.y + this.height, Color.LIME, 4);
    
        // Adjust the collider bounding box
        this.boxCollider.setData(colliderData);

        // Change sprite's origin
        this.setOrigin(spriteOrigin.x, spriteOrigin.y);

        this.inputSystem = scene.inputSystem;
    }

    // preUpdate(time, delta) {
    //     super.preUpdate(time, delta);
    //     //....
    // }

    update(){
        let movement = this.move();

        /* 
            We may ignore adjusting the box collider according to the sprites of idling, running, attacking for now
        */

        this.animator.update(movement, this.inputSystem.playAttack(), this.isDead());
        
        // debugPoints(this.scene.debugGraphics, this.x, this.y, Color.ORANGE, 7);
        // debugPoints(this.scene.debugGraphics, this.body.center.x, this.body.center.y, Color.RED);
    }

    move(){
        let dirX = 0, dirY = 0;

        if (this.inputSystem.moveLeft())
            dirX = -1;
        else if (this.inputSystem.moveRight())
            dirX = 1;
        
        if (this.inputSystem.moveUp())
            dirY = -1;
        else if (this.inputSystem.moveDown())
            dirY = 1;

        // Normalize diagonal direction by scaling 1/sqrt(2) because
        // in RGP, moving diagonally's often faster than moving orthogonally
        if (dirX !== 0 && dirY !== 0){
            dirX *= Math.SQRT1_2;
            dirY *= Math.SQRT1_2;
        }

        this.setVelocity(dirX * this.speed, dirY * this.speed);

        return {x: this.body.velocity.x, y: this.body.velocity.y};
    }

    isDead(){ return this.hp <= 0; }
}