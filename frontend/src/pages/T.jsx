import Scene1 from "../games/FantasyAdventure/1.prologue";

export default function T(){
    let config = {
        type: Phaser.AUTO,
        // Allows Phaser canvas to be responsive to browser sizing
        // scale: {
        //     mode: Phaser.Scale.ENVELOP,
        //     mode: Phaser.Scale.FIT,
        //     autoCenter: Phaser.Scale.CENTER_BOTH,
        //     // width: 1500,
        //     // height: 1000,
        //     // parent: 'game-container',
        // },
        width: 800,
        height: 1000,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: true
            }
        },
        scene: Scene1
    }

    new Phaser.Game(config);
}