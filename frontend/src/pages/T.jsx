import Scene1 from "@/games/FantasyAdventure/1.prologue";

export default function T(){
    let config = {
        type: Phaser.AUTO,
        // Allows Phaser canvas to be responsive to browser sizing
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        width: window.innerWidth,
        height: window.innerHeight,
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