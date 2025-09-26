import Phaser from "phaser";
import Player from "../../entities/Player";
import { createSwordfuckerAnims, loadSwordfuckerAnims } from "../../animations/SwordfuckerAnims";
import { debugBox, debugPoints, debugTilemapCollider } from "../../utils/debug";
import { Color } from "../../utils/constants";
import { ColliderData } from "../../utils/physicsUtil";
import InputSystem from '../../utils/InputSystem';

const ASSETS_ROOT_PATH = 'games/fantasy-adventure/';
const RESOURCES_PATH = ASSETS_ROOT_PATH + 'resources/';
const TILESETS_PATH = RESOURCES_PATH + 'Pixel Crawler - Free Pack/Environment/Tilesets/';
const TREES_PATH =  RESOURCES_PATH + 'Pixel Crawler - Free Pack/Environment/Props/Static/Trees/';
const TILEMAPS_PATH = ASSETS_ROOT_PATH + 'tilemaps/';
// const CHAR_CARRY_PATH = RESOURCES_PATH + 'Pixel Crawler - Free Pack/Entities/Characters/Body_A/Animations/';

export default class Scene1 extends Phaser.Scene{
    /* Environment */
    tilemap;
    wallLayer;
    treeColliders;

    /* Entities */
    player;

    inputSystem;
    debugGraphics;

    preload(){
        this.load.image('floor_tiles', TILESETS_PATH + 'Floors_Tiles.png');
        this.load.image('wall_tiles', TILESETS_PATH + 'Wall_Tiles.png');
        this.load.spritesheet(
            'trees_spritesheet_02_03',
            TREES_PATH + 'Model_02/Size_03.png',
            {frameWidth: 48, frameHeight: 80}
        );
        this.load.spritesheet(
            'trees_spritesheet_02_05',
            TREES_PATH + 'Model_02/Size_05.png',
            {frameWidth: 96, frameHeight: 160}
        );

        this.load.tilemapTiledJSON('map01', TILEMAPS_PATH + 'map01.json');

        loadSwordfuckerAnims(this);
    }

    create(){
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setDepth(999999);    // Render on top of everything else
            
        // Create environment
        this.createEnvironment();

        // debugTilemapCollider(this.debugGraphics, this.wallLayer);
        
        // Create Input System
        this.inputSystem = new InputSystem(this);
        
        // Create Player
        this.player = new Player(
            this, {x: 100, y: 350}, "Swordfucker-idle", 
            {x:2, y:2}, {x: 0.5, y: 0.7}, 
            new ColliderData(0.5, 0.2, 0, 20)
        );
        createSwordfuckerAnims(this.player.anims);
        this.player.anims.play('idle');

        // ======== Physics config ========= //
        this.physics.world.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.player.setCollideWorldBounds(true);

        // Create Collision Matrix
        this.setupCollisionMatrix();
        
        this.setupCamera();
    }

    createEnvironment(){
        // ====== Create a tilemap with different layers ======== //
        const tilemap = this.make.tilemap({key:'map01'});
        this.tilemap = tilemap;
        const floorTileset = tilemap.addTilesetImage('FloorTileset', 'floor_tiles');
        const wallTileset = tilemap.addTilesetImage('WallTileset', 'wall_tiles');

        const floorLayer = this.tilemap.createLayer('Floor', floorTileset);
        const wallLayer = tilemap.createLayer('Wall', wallTileset);
        this.wallLayer = wallLayer;
        wallLayer.setCollisionByProperty({ collision: true });

        // ======= Create static trees ======== //
        const treeLayer = tilemap.getObjectLayer('Trees');
        
        this.treeColliders = this.physics.add.staticGroup();

        let treeObjTileGIDs = new Set();    // Get all tile sprites'gids

        /*
            This is used for sorting sprites layer
            + key: gid, value: a list of y-coords accordingly to the obj's id (not gid)
            + E.g. gid=56 tile sprite is used by 4 tiled objects (meaning they have the same gid)
                whose ids=[4,7,8,19] and y-coords=[y1,y2,y3,y4]
                => stores {56, [y1,y2,y3,y4]}

                Thankfully, tilemap.createFromObjects() returns corresponding order
                This order will correspond the list of Phaser's GOs created by tilemap.createFromObjects(layer, {gid:56})
                Meaning a list will be [GO whose id=4, GO whose id=7,....] even though GO doesn't store `id`
        */
        let yCoordsMap = new Map();

        treeLayer.objects.forEach(obj => {
            if (obj.gid){   // Tiled Object

                // Handle creating collider
                if (obj.properties){
                    // Get the reference of its collider
                    let colliderRef = obj.properties.find(property => property.name === 'collider');

                    if (colliderRef){
                        let collider = treeLayer.objects.find(obj => obj.id === colliderRef.value); // This must be found
                    
                        if (collider.ellipse){
                            let colliderGO = this.add.rectangle(collider.x, collider.y, collider.width, collider.height);

                            // By default, Geometric Objects in Tiled are set its top-left as origin
                            // But Phaser set at the center
                            // colliderGO.setOrigin(0, 0);
                            // or
                            colliderGO.setPosition(collider.x + collider.width/2, collider.y + collider.height/2);

                            // colliderGO.body.setCircle(Math.max(collider.width, collider.height)/2);

                            this.treeColliders.add(colliderGO);
                        }
                    }
                }

                if (yCoordsMap.get(obj.gid)) yCoordsMap.get(obj.gid).push(obj.y);
                else yCoordsMap.set(obj.gid, [obj.y]);

                treeObjTileGIDs.add(obj.gid);
            }
        });

        let firstGid, key;
        for (let gid of treeObjTileGIDs){
            // Check to use the correct spritesheet as we may create trees using different spritesheets
            if (gid < tilemap.getTileset('Trees_02_05').firstgid){
                firstGid = tilemap.getTileset('Trees_02_03').firstgid;
                key = 'trees_spritesheet_02_03';
            }
            else{
                firstGid = tilemap.getTileset('Trees_02_05').firstgid;
                key = 'trees_spritesheet_02_05';
            }

            let sprites = tilemap.createFromObjects('Trees', {
                gid: gid,
                key: key,
                frame: gid - firstGid
            });
            let yCoords = yCoordsMap.get(gid);

            sprites.forEach((value, index)=>{
                let zDepth = yCoords[index];
                value.setDepth(zDepth);     // Set sprite sorting layer

                // Annoyingly, an origin of a Tiled object in Tile is set to the bottom-left:))????
                // But thankfully, tilemap.createFromObjects somehow manage to reset the origin to center in Phaser
                
                // However, in 2D RGP, its origin is preferred to set to near center bottom
                value.setOrigin(0.5, 0.85);
                value.setPosition(value.x, value.y + value.displayHeight*(0.85-0.5));
            })
        }
        
        /*
            USING TILED OBJECTS IN "Tile Layer"
            where each tile object has its collider created in Tile Collision Editor
            - We can access each collider via 
            ```
                layer = tilemap.createLayer('tileLayerName in Tiled', tileset)
                            .setCollisionFromCollisionGroup()
                layer.forEachTile(tile => 
                    tile.getCollisionGroup().objects.forEach(obj => ...)
                )
            ```
            - But the sprites (of tiled object) are unresizable like other ordinary game objects
        */
    }
    
    update(){
        // this.debugGraphics.clear();
        this.player.update();
    }

    setupCollisionMatrix(){
        this.physics.add.collider(this.player, this.wallLayer);
        this.physics.add.collider(this.player, this.treeColliders);
    }

    setupCamera(){
        this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.cameras.main.startFollow(this.player);
    }

}