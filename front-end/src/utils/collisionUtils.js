import React from "react";
import { removeEnemy } from "./commonUtils";

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
    explosionSfxRef,
    extraCollisionFn
) => {
    if (enemy.destroyed) return;
    if (!checkCollision(projectileRef, enemy.ref)) return;
    // console.log("Collision detected!");

    explosionSfxRef?.current.play();
    removeEnemy(enemy.id, setEnemies);
    extraCollisionFn();
};

export function useCollision(
    enemies,
    setEnemies,
    ref,
    explosionSfxRef,
    extraCollideFn
) {
    React.useEffect(() => {
        const interval = setInterval(() => {
            // Check for collisions with enemies
            // console.log(enemies);
            for (let i = 0; i < enemies?.length; i++) {
                const enemy = enemies[i];
                // console.log(ref, "Projectile with enemy:", enemy.ref);
                // console.log(enemies, "Enemies in ProjectileSprite");
                projectileEnemyCollision(
                    ref,
                    enemy,
                    setEnemies,
                    explosionSfxRef,
                    () => extraCollideFn(enemy.text)
                );
            }
        }, 100);

        return () => clearInterval(interval);
    }, [enemies]);
}
