import { removeEnemy } from "./commonUtils";

const explosionSfx = new Audio("/space-shooter/sounds/explosion-312361.mp3");
explosionSfx.volume = 1.0;

function checkCollision(ref1, ref2) {
    if (!ref1 || !ref2) {
        return false;
    }
    if (!ref1.current || !ref2.current) {
        return false;
    }

    const bounds1 = ref1.current.getBounds();
    const bounds2 = ref2.current.getBounds();
    // console.log("Checking collision between:", bounds1, bounds2);

    const isColliding =
        bounds1.x <= bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width >= bounds2.x &&
        bounds1.y <= bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height >= bounds2.y;

    return isColliding;
}

export const projectileEnemyCollision = (
    projectileRef,
    enemy,
    setEnemies,
    extraCollisionFn
) => {
    if (enemy.destroyed) return;
    if (!checkCollision(projectileRef, enemy.ref)) return;
    // console.log("Collision detected!");

    explosionSfx.cloneNode().play();
    removeEnemy(enemy.id, setEnemies);
    extraCollisionFn();
};
