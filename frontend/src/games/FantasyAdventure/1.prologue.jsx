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
    tilemap;
    wallLayer;

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

        this.load.tilemapTiledJSON('map01', TILEMAPS_PATH + 'map01.json');

        loadSwordfuckerAnims(this);
    }

    create(){
        // Create a tilemap with different layers
        // this.tilemap = this.make.tilemap({key:'map01'});
        // const floorTileset = this.tilemap.addTilesetImage('FloorTileset', 'floor_tiles');
        // const wallTileset = this.tilemap.addTilesetImage('WallTileset', 'wall_tiles');

        // const floorLayer = this.tilemap.createLayer('Floor', floorTileset);
        // const wallLayer = this.tilemap.createLayer('Wall', wallTileset);

        // // console.log(tetLayer)
        // console.log(this.tilemap)
        // // let treeLayer = this.make.tilemap({key:'map01'}).createLayer(1, 'Trees').setCollisionFromCollisionGroup(true);
        // wallLayer.setCollisionByProperty({ collision: true });
        // treeLayer.setCollisionFromCollisionGroup();

        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setDepth(9999999999);    // Render on top of everything else
        this.createTilemap();

        // Create Input System
        this.inputSystem = new InputSystem(this);

        // debugTilemapCollider(this.debugGraphics, this.wallLayer);
        
        this.player = new Player(
            this, {x: 100, y: 350}, "Swordfucker-idle", 
            {x:2, y:2}, {x: 0.5, y: 0.7}, 
            new ColliderData(0.5, 0.2, 0, 20)
        );
        // Create Animations
        createSwordfuckerAnims(this.player.anims);
        this.player.anims.play('idle');

        // console.log('Here', this.make.tilemap({key:'map01'}).createFromObjects('Trees', {
        //     gid: 1276,
        //     key: 'trees_spritesheet_02_03'
        // }))
        
        // let trees = this.tilemap.createFromObjects('Trees', {
        //     // gid: 1276,
        //     key:'trees'
        // })

        // trees.forEach(tree => {
        //     // console.log('Here', tree)
        //     this.physics.add.existing(tree, true);
        //     // this.physics.world.enable(tree);
 
        //     this.physics.add.collider(this.player, tree);

        // })

        // const trees = this.physics.add.staticGroup();
        // const treesLayer = this.tilemap.getObjectLayer('Trees');
        // let depths = new Map();
        // console.log('Trees Layer', treesLayer)
        // treesLayer.objects.forEach(tree => {
        //     // trees.get(tree.x, tree.y, 'trees')

        //     // let t = this.physics.add.sprite(tree.x, tree.y, 'trees');
        //     // t.setScale(3,3);
        //     // t.body.setSize(tree.width, tree.height);

        //     let gameObject = this.add.rectangle( tree.x, tree.y, tree.width, tree.height );

        //     if (tree.gid){
        //         depths.set(tree.id, tree.y);
        //         gameObject.setOrigin(0, 1);
        //     }

        //     else if (tree.ellipse){
        //         gameObject.setOrigin(0, 0);
        //     }


        //     // let gameObject = this.add.ellipse( tree.x, tree.y, tree.width, tree.height )
        //     //     .setOrigin(0, 1);
        
        //     if (!tree.gid){
        //         this.physics.add.existing( gameObject, true );
        //         this.physics.add.collider(this.player, gameObject );
        //     }
        //     if (tree.properties){
        //         console.log(tree.properties)
        //         // console.log(typeof(tree.properties[0]))
        //         // tree.properties.forEach(e => console.log(e))
        //         console.log(tree.properties.find(e => e.name==='age'))
        //     }
            
        //     // if(tree.ellipse){
        //     // // For the ellipse version you would need to change the body
        //     //     gameObject.body.setCircle( tree.width / 2 );
        //     //     // gameObject = this.add.ellipse(tree.x, tree.y, tree.width, tree.height);

        //     // } else if(tree.point){
        //     //     // For the point we need no set an width and height
        //     //     gameObject.body.setSize( 4, 4 );
        //     // }
        //     debugPoints(this.debugGraphics, tree.x, tree.y);
        //     // this.physics.add.collider(this.player, gameObject );
        // })

        // let firstGid = this.tilemap.tilesets[2].firstgid;
        // let spriteArr = this.tilemap.createFromObjects('Trees', {
        //     gid: 1278,
        //     key: 'trees_spritesheet_02_03',
        //     frame: 1278 - firstGid
        // });
        // // spriteArr.forEach((item, idx)=>{
        // //     console.log(item)
        // // })
        // this.tilemap.createFromObjects('Trees', {
        //     id: 68,
        //     key: 'trees_spritesheet_02_03',
        //     frame: 1276 - firstGid
        // })[0].setDepth(1);

        // this.tilemap.createFromObjects('Trees', {
        //     id: 72,
        //     key: 'trees_spritesheet_02_03',
        //     frame: 1276 - firstGid
        // })[0].setDepth(10);

        // // console.log(spriteArr);
        // console.log(depths)

        // ======== Physics config ========= //
        this.physics.world.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.player.setCollideWorldBounds(true);

        // Create Collision Matrix
        this.physics.add.collider(this.player, this.wallLayer);
        // this.physics.add.collider(this.player, tetLayer, (o1, o2)=>{
        //     console.log(o1)
        //     debugBox(this.debugGraphics, o2.pixelX, o2.pixelY, o2.width, o2.height)
        //     console.log(o2)
        // });
        
        this.setupCamera();
    }

    createTilemap(){
        // Create a tilemap with different layers
        const tilemap = this.make.tilemap({key:'map01'});
        this.tilemap = tilemap;
        const floorTileset = tilemap.addTilesetImage('FloorTileset', 'floor_tiles');
        const wallTileset = tilemap.addTilesetImage('WallTileset', 'wall_tiles');

        const floorLayer = this.tilemap.createLayer('Floor', floorTileset);
        const wallLayer = tilemap.createLayer('Wall', wallTileset);
        this.wallLayer = wallLayer;
        wallLayer.setCollisionByProperty({ collision: true });

        const treeLayer = tilemap.getObjectLayer('Trees');
        
        // console.log(tilemap)
        console.log(treeLayer.objects)

        let treeObjTileGIDs = new Set();

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

                            this.physics.add.existing(colliderGO, true);
                            // colliderGO.body.setCircle(Math.max(collider.width, collider.height)/2)
                        }
                    }
                }

                if (yCoordsMap.get(obj.gid)) yCoordsMap.get(obj.gid).push(obj.y);
                else yCoordsMap.set(obj.gid, [obj.y]);

                treeObjTileGIDs.add(obj.gid);
            }
        });

        console.log(yCoordsMap)

        let firstGid = tilemap.getTileset('Trees_03').firstgid;
        let color = [Color.BLUE, Color.YELLOW];
        let i = 0;

        debugPoints(this.debugGraphics, 235.53, 278.67, Color.LIME, 10);
        debugPoints(this.debugGraphics, 244.67, 123.33, Color.LIME, 10);
        for (let gid of treeObjTileGIDs){
            let sprites = tilemap.createFromObjects('Trees', {
                gid: gid,
                key: 'trees_spritesheet_02_03',
                frame: gid - firstGid
            })
            let yCoords = yCoordsMap.get(gid);

            console.log(sprites)
            sprites.forEach((value, index)=>{
                let zDepth = yCoords[index];
                value.setDepth(zDepth);

                // Annoyingly, an origin of a Tiled object in Tile is set to the bottom-left:))????
                // But thankfully, tilemap.createFromObjects somehow manage to reset the origin to center in Phaser
                
                // However, in 2D RGP, its origin is preferred to set to near center bottom
                value.setOrigin(0.5, 0.85);
                value.setPosition(value.x, value.y + value.displayHeight*(0.85-0.5));

                debugPoints(this.debugGraphics, value.x, value.y, color[i], i+5)
            })
            i++;
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

        // const tetLayer = this.make.tilemap({key:'map01'})
        //     .createLayer('Tile Layer 3', tetTileset)
        //     .setCollisionFromCollisionGroup();
        // tetLayer.forEachTile(tile => {
        //     const tileWorldX = tile.getLeft();
        //     const tileWorldY = tile.getTop();
        //     const collisionGroup = tile.getCollisionGroup();
            
        //     if (!collisionGroup || collisionGroup.objects.length === 0) {
        //         return; // Skip if no collision data
        //     }
        //     console.log(collisionGroup)
        //     console.log(tile)
        //     tile.setSize(tile.width*20, tile.height*20, tile.baseHeight, tile.baseWidth);

        //     // Iterate through the collision objects for this tile
        //     collisionGroup.objects.forEach(obj => {
        //         const objectX = tileWorldX + obj.x;
        //         const objectY = tileWorldY + obj.y;
        //         const objectWidth = obj.width;
        //         const objectHeight = obj.height;

        //         // Set the color for the collision shape
        //         // this.debugGraphics.lineStyle(2, 0x00ff00); // Green lines for visualization
        //         // this.debugGraphics.strokeRect(objectX, objectY, objectWidth, objectHeight);

        //         let shape;
        //         if (obj.ellipse) {
        //             shape = this.add.ellipse(objectX + obj.width/2, objectY + obj.height/2, obj.width, obj.height);
        //         } else {
        //             shape = this.add.rectangle(objectX + obj.width/2, objectY + obj.height/2, obj.width, obj.height);
        //         }

        //         // shape.setScale(2,2)

        //         // Make it invisible but collidable
        //         shape.setVisible(true);

        //         // console.log('Here', obj)
        //         this.physics.add.existing(shape, true)
        //         this.physics.add.collider(this.player, shape, (o1, o2)=>{
        //             console.log('O1', o1)
        //             debugBox(this.debugGraphics, o2.pixelX, o2.pixelY, o2.width, o2.height)
        //             console.log('O2', o2)
        //         });
        //     });
        // });
    }
    
    update(){
        // this.debugGraphics.clear();
        this.player.update();
    }

    setupCamera(){
        this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.cameras.main.startFollow(this.player);
    }

}