import Phaser from "phaser";
import Player from "../../entities/Player";
import { createSwordfuckerAnims, loadSwordfuckerAnims } from "../../animations/SwordfuckerAnims";
import { debugPoints, debugTilemapCollider } from "../../utils/debug";
import { Color } from "../../utils/constants";
import { ColliderData } from "../../utils/physicsUtil";
import InputSystem from '../../utils/InputSystem';

const ASSETS_ROOT_PATH = 'games/fantasy-adventure/';
const RESOURCES_PATH = ASSETS_ROOT_PATH + 'resources/';
const TILESETS_PATH = RESOURCES_PATH + 'Pixel Crawler - Free Pack/Environment/Tilesets/';
const TILEMAPS_PATH = ASSETS_ROOT_PATH + 'tilemaps/';
// const CHAR_CARRY_PATH = RESOURCES_PATH + 'Pixel Crawler - Free Pack/Entities/Characters/Body_A/Animations/';

export default class Scene1 extends Phaser.Scene{
    tilemap;
    player;
    inputSystem;
    debugGraphics;

    preload(){
        this.load.image('floor_tiles', TILESETS_PATH + 'Floors_Tiles.png');
        this.load.image('wall_tiles', TILESETS_PATH + 'Wall_Tiles.png');
        this.load.tilemapTiledJSON('map01', TILEMAPS_PATH + 'map01.json');

        loadSwordfuckerAnims(this);
    }

    create(){
        // Create a tilemap with different layers
        this.tilemap = this.make.tilemap({key:'map01'});
        const floorTileset = this.tilemap.addTilesetImage('FloorTileset', 'floor_tiles');
        const wallTileset = this.tilemap.addTilesetImage('WallTileset', 'wall_tiles');

        const floorLayer = this.tilemap.createLayer('Floor', floorTileset);
        const wallLayer = this.tilemap.createLayer('Wall', wallTileset);
        wallLayer.setCollisionByProperty({ collision: true });

        // Create Input System
        this.inputSystem = new InputSystem(this);
        
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setDepth(100);    // Render on top of everything else
        // debugTilemapCollider(this.debugGraphics, wallLayer);
        
        this.player = new Player(
            this, {x: 100, y: 350}, "Swordfucker-idle", 
            {x:2, y:2}, {x: 0.5, y: 0.7}, 
            new ColliderData(0.5, 0.2, 0, 20)
        );
        // Create Animations
        createSwordfuckerAnims(this.player.anims);
        this.player.anims.play('idle');


        // ======== Physics config ========= //
        this.physics.world.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.player.setCollideWorldBounds(true);

        // Create Collision Matrix
        this.physics.add.collider(this.player, wallLayer);

        this.setupCamera();
    }
    
    update(){
        this.debugGraphics.clear();
        this.player.update();
    }

    setupCamera(){
        this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.cameras.main.startFollow(this.player);
    }

}