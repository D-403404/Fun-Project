import Scene1 from "@/games/FantasyAdventure/1.prologue";

export default function T(){
    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 1000,
        parent: 'game-container',
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