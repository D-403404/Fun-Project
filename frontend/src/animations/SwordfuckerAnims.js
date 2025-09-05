
const ASSETS_ROOT_PATH = 'games/fantasy-adventure/';
const RESOURCES_PATH = ASSETS_ROOT_PATH + 'resources/';

const playerSpritesheets = {
    idle: {
        file: 'Idle-Sheet.png', numFrame: 4,
        frameWidth: 64, frameHeight: 80,
    },
    run: {
        file: 'Run-Sheet.png', numFrame: 8,
        frameWidth: 80, frameHeight: 80,
    },
    attack: {
        file: 'Attack-01-Sheet.png', numFrame: 8,
        frameWidth: 96, frameHeight: 80,
    },
    die: {
        file: 'Dead-Sheet.png', numFrame: 8,
        frameWidth: 80, frameHeight: 64,
    }
};

export const loadSwordfuckerAnims = (scene) =>{
    for (const action of Object.keys(playerSpritesheets)){
        let info = playerSpritesheets[action];
        let spritesheetKey = `Swordfucker-${action.toString()}`;
        scene.load.spritesheet(
            spritesheetKey,
            RESOURCES_PATH + 'Swordfucker/' + info.file,
            { frameWidth: info.frameWidth, frameHeight: info.frameHeight }
        );
    }
}

export const createSwordfuckerAnims = (anims) => {
    for (const action of Object.keys(playerSpritesheets)){
        let info = playerSpritesheets[action];
        let spritesheetKey = `Swordfucker-${action.toString()}`;
        let animKey = action.toString();
        anims.create({
            key: animKey,
            frames: anims.generateFrameNumbers(spritesheetKey, {
                start: 0, end: info.numFrame - 1,
            }),
            frameRate: 8,
            repeat: animKey !== 'attack' && animKey !== 'die' ? -1 : 0,
            // repeat: -1,
        })
    }
}