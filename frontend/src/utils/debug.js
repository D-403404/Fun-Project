import Phaser from 'phaser';
import { Color } from './constants';

export const debugTilemapCollider = (debugGraphics, collisionLayer) => {
    debugGraphics.setAlpha(0.6);
    collisionLayer.renderDebug(debugGraphics, {
        tileColor: null,    // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 128),    // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)      // Color of colliding face edges
    });
}

export const debugPoints = (debugGraphics, x, y, color=Color.RED, radius=5) => {
    debugGraphics.setAlpha(1);
    debugGraphics.fillStyle(color.color, 1);    // use color.color to exclude α channel (i.e. getting the color but not the object Color)
    debugGraphics.fillCircle(x, y, radius);
}