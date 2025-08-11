import { useTick } from "@pixi/react";
import { Assets } from "pixi.js";
import React from "react";
import { projectileEnemyCollision } from "@/utils/collisionUtils";

const ProjectileSprite = ({
    ref,
    shooterRef,
    enemies,
    setEnemies,
    textureUrl,
    extraCollideFn,
}) => {
    const [texture, setTexture] = React.useState(null);
    const [position, setPosition] = React.useState({
        x: 0,
        y: 0,
    });
    const vx = 0; // Horizontal velocity, not used in this case
    const vy = -10; // Vertical velocity for the laser beam

    React.useEffect(() => {
        if (texture === null) {
            // Load the laser beam texture
            Assets.load(textureUrl).then((result) => {
                setTexture(result);
            });
        }

        if (shooterRef.current) {
            // Update the position of the laser beam based on the spaceship's position
            setPosition({
                x: shooterRef.current.x,
                y: shooterRef.current.y - 50, // Adjust for the laser beam's offset
            });
        }
    }, [texture, shooterRef, textureUrl]);

    useTick((tickObj) => {
        setPosition((prevPosition) => ({
            x: prevPosition.x + vx * tickObj.deltaTime,
            y: prevPosition.y + vy * tickObj.deltaTime, // Move the laser beam upwards
        }));
        // console.log(delta, "Laser Beam Tick");]
    });

    React.useEffect(() => {
        const interval = setInterval(() => {
            // Check for collisions with enemies
            for (let i = 0; i < enemies?.length; i++) {
                const enemy = enemies[i];
                // console.log(ref, "Projectile with enemy:", enemy.ref);
                // console.log(enemies, "Enemies in ProjectileSprite");
                projectileEnemyCollision(ref, enemy, setEnemies, () =>
                    extraCollideFn(enemy.text)
                );
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <pixiSprite
            ref={ref}
            texture={texture}
            x={position.x}
            y={position.y}
            anchor={0.5}
            rotation={Math.PI / 2} // Pointing upwards
            scale={0.05}
            visible={shooterRef.current}
        />
    );
};

export default ProjectileSprite;
