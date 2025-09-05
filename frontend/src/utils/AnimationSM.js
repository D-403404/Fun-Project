
export default class AnimationSM{
    /*
        Animation State Machine which controls the transition 
        between animation states

        We're currently making for 4 states only
                _____speed=0__
                |             |
                V             |
        __Initial: idle       run __
        |   ^   |             ^    |
        |   |   |___speed>0___|    |
        |   |                      |
        |   V                      |
        | attack <-----------------|
        |                          |
        V                          |
        die (terminate) <----------|
    */

    constructor(obj){
        this.obj = obj; // A Phaser.Physics.Arcade.Sprite instance
        this.currentState = 'idle';

        this.locked = false; // For locking transitions (e.g., during attack or die)

        // Listen to 'triggered' animation complete for 'attack' and 'die'
        this.obj.on('animationcomplete', this.onAnimationComplete, this);
    }

    onAnimationComplete(animation, frame) {
        if (animation.key === 'attack') {
            this.locked = false;
            this.setState('idle');
        }
        else if (animation.key === 'die') {
            this.locked = true;
            // this.obj.setVelocity(0, 0);
        }
    }

    update(movement, isAttacking, isDead){
        /* This function based on the `obj`'s update */

        if (this.locked) return;

        let dirX = Math.sign(movement.x);
        let dirY = Math.sign(movement.y);

        if (dirX === -1) this.obj.setFlipX(true);
        else if (dirX === 1) this.obj.setFlipX(false);

        let state = 'idle';
        if (isDead){
            this.locked = true;
            state = 'die';
        }
        else if (isAttacking){
            this.locked = true;
            state = 'attack';

            // let attackAnim = this.obj.anims.get('attack');
            // let animationClipLength = attackAnim.frames.length / attackAnim.frameRate;
            // this.scene.time.delayedCall(animationClipLength*1000, () => {
            //      // isAttacking=false
            // })
        }
        else if (dirX !== 0 || dirY !== 0){
            state = 'run';
        }

        this.setState(state);
    }

    setState(newState){
        if (this.currentState === newState) return;

        this.currentState = newState;
        this.obj.anims.play(newState);
    }

}