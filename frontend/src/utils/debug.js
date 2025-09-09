import Phaser from 'phaser';
import { Color } from './constants';

export const debugTilemapCollider = (graphics, collisionLayer) => {
    graphics.setAlpha(0.6);
    collisionLayer.renderDebug(graphics, {
        tileColor: null,    // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 128),    // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)      // Color of colliding face edges
    });
}

export const debugPoints = (graphics, x, y, color=Color.RED, radius=5) => {
    graphics.setAlpha(1);
    graphics.fillStyle(color.color, 1);    // use color.color to exclude α channel (i.e. getting the color but not the object Color)
    graphics.fillCircle(x, y, radius);
}

export const debugBox = (graphics, x, y, width, height, color=Color.RED, thickness=3)=>{
    graphics.lineStyle(thickness, color.color);
    graphics.strokeRect(x, y, width, height);
}

export const debugGameObject = (graphics, ap) => {
    let points = [];
    // ==== Debug GameObject ====
    // debugPoints(graphics, ap.getCenter().x, ap.getCenter().y, Color.ORANGE, 8);
    debugPoints(graphics, ap.x, ap.y, Color.LIME, 5);
    points = [
        {x: ap.x - ap.width/2, y: ap.y - ap.height/2},
        {x: ap.x + ap.width/2, y: ap.y - ap.height/2},
        {x: ap.x - ap.width/2, y: ap.y + ap.height/2},
        {x: ap.x + ap.width/2, y: ap.y + ap.height/2}
    ]
    points.forEach(p => {
        debugPoints(graphics, p.x, p.y, Color.LIME, 4);
    })

    // debugBox(graphics, ap.x-ap.width/2, ap.y-ap.height/2, ap.width, ap.height);
    

    // ==== Debug box collider ====
    debugPoints(graphics, ap.body.center.x, ap.body.center.y, Color.BLUE, 3);
    points = [
        {x: ap.body.x, y: ap.body.y},
        {x: ap.body.x + ap.body.width, y: ap.body.y},
        {x: ap.body.x, y: ap.body.y + ap.body.height},
        {x: ap.body.x + ap.body.width, y: ap.body.y + ap.body.height}
    ]
    points.forEach(p => {
        debugPoints(graphics, p.x, p.y, Color.BLACK, 3);
    })

    debugBox(graphics, ap.body.x, ap.body.y, ap.body.width, ap.body.height, Color.BLACK, 6);
    // or
    // debugBox(graphics,
    //     ap.body.center.x - ap.body.width/2,
    //     ap.body.center.y - ap.body.height/2,
    //     ap.body.width, ap.body.height, Color.BLACK, 6
    // );
}