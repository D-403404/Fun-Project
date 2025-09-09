import Phaser from 'phaser'
import { debugGameObject, debugPoints } from '../utils/debug';
import { Color } from '../utils/constants';
import { BoxCollider } from '../utils/physicsUtil';
import AnimationSM from '../utils/AnimationSM';

export default class Player extends Phaser.Physics.Arcade.Sprite{
    speed=400;
    inputSystem;

    boxCollider;
    initialData;
    curState;

    animator;
    hp=10;  // health point

    constructor(
        scene, position, texture, scale={x:1, y:1},
        spriteOrigin={x: 0.5, y: 0.5}, colliderData=null
    ){
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
    
        // Change the scale of the Game Object
        // If you log out this.width, this.height, they aren't changed but the body.width, body.height
        // Because it simply sets the `scaleX`, `scaleY` variable
        this.setScale(scale.x, scale.y);
        
        // Change sprite's origin
        this.setOrigin(spriteOrigin.x, spriteOrigin.y);

        // colliderData.scaleWidth=colliderData.scaleHeight=1;
        // colliderData.offsetX=colliderData.offsetY=0;

        // Adjust the collider bounding box
        this.boxCollider.setData(colliderData);
        
        this.inputSystem = scene.inputSystem;
        this.initialData = {
            position: {x: position.x, y: position.y },
            spriteOrigin: spriteOrigin,
            offset: {x: colliderData.offsetX, y: colliderData.offsetY}
        }
        this.curState = 'idle';

        console.log('Gameobj: ', this.width, this.height)
        console.log('Body: ', this.body.width, this.body.height)
        console.log('Create:', this.body.offset)
        // debugPoints(scene.debugGraphics, this.body.x, this.body.y, Color.RED, 6);
        // debugPoints(scene.debugGraphics, this.body.x + this.body.width, this.body.y, Color.RED, 6);
        debugPoints(scene.debugGraphics, this.body.x + this.body.offset.x, this.body.y + this.body.offset.y, Color.YELLOW, 4);
        debugPoints(scene.debugGraphics, this.x, this.y, Color.ORANGE, 5);

    }

    // preUpdate(time, delta) {
    //     super.preUpdate(time, delta);
    //     //....
    // }

    update(){
        let movement = this.updateMovement();

        /* 
            We may ignore adjusting the box collider according to the sprites of idling, running, attacking for now
        */

        this.animator.update(movement, this.inputSystem.playAttack(), this.isDead());
        
        this.updateBoxCollider(movement);
        // this.boxCollider.centerBody();

        debugGameObject(this.scene.debugGraphics, this);
        
        // debugPoints(this.scene.debugGraphics, this.x, this.y, Color.ORANGE, 8);
        // debugPoints(this.scene.debugGraphics, this.getCenter().x, this.getCenter().y, Color.LIME, 8);
        // debugPoints(this.scene.debugGraphics, this.body.x, this.body.y, Color.BLACK, 8);
        // debugPoints(this.scene.debugGraphics, this.body.x + this.body.width, this.body.y, Color.BLACK, 8);
        // debugPoints(this.scene.debugGraphics, this.x + this.body.offset.x, this.y + this.body.offset.y, Color.MAGENTA, 6);
        // debugPoints(this.scene.debugGraphics, this.x, this.y, Color.ORANGE, 7);
        // debugPoints(this.scene.debugGraphics, this.body.center.x, this.body.center.y, Color.RED);
    }

    updateBoxCollider(movement){
        if (movement.x > 0){
            if (this.curState !== 'run-right'){
                this.boxCollider.setOffsetX(0);
                this.curState = 'run-right';
            }
        }
        else if (movement.x < 0){
            if (this.curState !== 'run-left'){
                this.boxCollider.setOffsetY(-50);
                this.curState = 'run-left';
            }
        }
        else if (movement.x === 0 && movement.y === 0){
            if (this.curState !== 'idle'){
                // console.log('Here 1', this.body.offset);

                // this.body.setOffset(0, 0);
                // this.body.offset.x = 0;
                // this.body.offset.y = 30;

                // this.boxCollider.centerBody();

                // let currentOffset = this.body.offset;
                // this.body.setOffset(currentOffset.x + 10, currentOffset.y+20);

                // debugPoints(this.scene.debugGraphics, this.body.center.x, this.body.center.y, Color.MAGENTA, 7);
                this.boxCollider.setOffset(this.initialData.offset, true);

                this.curState = 'idle';
            }

        }
    }

    updateMovement(){
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