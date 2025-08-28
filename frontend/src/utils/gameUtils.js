import React from "react";
import { Howl, Howler } from "howler";
import { useTick } from "@pixi/react";

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
    explosionSfx,
    extraCollisionFn
) => {
    if (enemy.destroyed) return;
    if (!checkCollision(projectileRef, enemy.ref)) return;
    console.log("Collision detected!");

    explosionSfx.play();
    removeEnemy(enemy.id, setEnemies);
    extraCollisionFn();
};

export function removeEnemy(id, setEnemies) {
    setEnemies((prev) => {
        const enemy = prev.find((e) => e.id === id);
        if (enemy?.ref?.current && !enemy?.ref?.current.destroyed) {
            enemy.destroyed = true; // Mark as destroyed
            enemy.ref.current.destroy({
                children: true,
            });
        }
        return prev.filter((e) => e.id !== id);
    });
    // console.log(`Enemy with id ${id} removed`);
}

//=======================PHASER HELPERS=======================//

export function addBodyBorder(scene, body, color = 0xff0000, thickness = 2) {
    const graphics = scene.add.graphics();
    graphics.lineStyle(thickness, color);

    // Draw the initial border
    graphics.strokeRect(body.x, body.y, body.width, body.height);

    // Update the border every frame
    scene.events.on("update", () => {
        graphics.clear();
        graphics.lineStyle(thickness, color);
        graphics.strokeRect(body.x, body.y, body.width, body.height);
    });

    return graphics;
}

//=======================CUSTOM HOOKS=======================//

export function useCollision(
    enemies,
    setEnemies,
    ref,
    explosionSfx,
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
                    explosionSfx,
                    () => extraCollideFn(enemy.text)
                );
            }
        }, 50);

        return () => clearInterval(interval);
    }, [enemies]);
}

export function useControls(ref, speed = 10, invertControl = false) {
    // Booleans for pressed keys
    const left = React.useRef(false);
    const right = React.useRef(false);
    const up = React.useRef(false);
    const down = React.useRef(false);

    React.useEffect(() => {
        const onKeyDown = (e) => {
            switch (e.key.toLowerCase()) {
                case "arrowleft":
                case "a":
                    left.current = true;
                    break;
                case "arrowright":
                case "d":
                    right.current = true;
                    break;
                case "arrowup":
                case "w":
                    up.current = true;
                    break;
                case "arrowdown":
                case "s":
                    down.current = true;
                    break;
            }
        };

        const onKeyUp = (e) => {
            switch (e.key.toLowerCase()) {
                case "arrowleft":
                case "a":
                    left.current = false;
                    break;
                case "arrowright":
                case "d":
                    right.current = false;
                    break;
                case "arrowup":
                case "w":
                    up.current = false;
                    break;
                case "arrowdown":
                case "s":
                    down.current = false;
                    break;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useTick(() => {
        const object = ref.current;
        if (!object) return;

        let dx = 0,
            dy = 0;
        const velocity = invertControl ? -speed : speed;

        if (left.current) dx -= velocity;
        if (right.current) dx += velocity;
        if (up.current) dy -= velocity;
        if (down.current) dy += velocity;

        // Normalize diagonal speed
        if (dx !== 0 && dy !== 0) {
            const diagSpeed = velocity / Math.sqrt(2);
            dx = dx > 0 ? diagSpeed : -diagSpeed;
            dy = dy > 0 ? diagSpeed : -diagSpeed;
        }

        object.x = Math.max(0, Math.min(object.x + dx, window.innerWidth));
        object.y = Math.max(0, Math.min(object.y + dy, window.innerHeight));
    });
}

export function useCheat(cheatCode = [], setCheatActive, bgm) {
    const bgmVolume = bgm.volume();
    const cheatSfx = React.useMemo(() => {
        const audio = new Howl({
            src: ["windows-sounds/Windows XP Startup.mp3"],
            onplay: () => {
                if (bgm && bgmVolume > 0.1) bgm.volume(0.1); // Lower the volume of the background music
            },
            onend: () => {
                if (bgm) bgm.volume(bgmVolume); // Restore volume when cheatSfx ends
            },
        });
        console.log("Cheat SFX created");
        return audio;
    }, [bgm]);
    const cheatCodeLower = cheatCode.map((key) => key.toLowerCase());
    const cheatIndex = React.useRef(0);
    const checkCheatCode = React.useCallback(
        (e) => {
            if (e.key.toLowerCase() === cheatCodeLower[cheatIndex.current]) {
                cheatIndex.current++;
                if (cheatIndex.current === cheatCodeLower.length) {
                    setCheatActive(true);
                    cheatSfx.play();
                    console.log("Cheat activated!");
                    cheatIndex.current = 0; // Reset cheat index
                }
            } else {
                cheatIndex.current = 0; // Reset if the sequence is broken
            }
        },
        [cheatCodeLower, setCheatActive, cheatSfx]
    );

    React.useEffect(() => {
        window.addEventListener("keydown", checkCheatCode);

        return () => window.removeEventListener("keydown", checkCheatCode);
    }, [checkCheatCode]);
}
