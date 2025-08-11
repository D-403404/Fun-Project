import React from "react";
import EnemySprite from "./sprites/EnemySprite";
import { removeEnemy } from "@/utils/commonUtils";

const RandomEnemySpawner = ({
    enemies,
    setEnemies,
    textureUrlList = [],
    textList = [],
    isRotating = false,
    maxEnemyNumber = 0,
}) => {
    const textStyle = React.useMemo(
        () => ({
            fontWeight: "bold",
        }),
        []
    );

    React.useEffect(() => {
        const addEnemyInterval = setInterval(() => {
            if (enemies.length >= maxEnemyNumber) {
                return; // Stop spawning if maxEnemyNumber is reached
            }
            const id = "enemy-" + Math.random();
            const newEnemy = {
                id: id,
                textureUrl:
                    textureUrlList[
                        Math.floor(Math.random() * textureUrlList.length)
                    ],
                text: textList[Math.floor(Math.random() * textList.length)],
                x: (Math.random() * (0.8 - 0.2) + 0.2) * window.innerWidth,
                y: (Math.random() * (0.8 - 0.2) + 0.2) * window.innerHeight,
                destroyed: false, // Flag to check if the enemy is destroyed
                ref: React.createRef(), // Reference to the enemy sprite
            };
            setEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
            // console.log(newEnemy);

            // Give this enemy its own despawn time
            const despawnTime = Math.random() * (7000 - 3000) + 3000; // 3-7 seconds
            setTimeout(() => {
                removeEnemy(id, setEnemies);
            }, despawnTime);
        }, 500);

        return () => clearInterval(addEnemyInterval);
    }, [maxEnemyNumber, enemies.length]);

    // Uncomment the following code to enable automatic enemy removal after a fixed time
    // React.useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (Math.random() < 0.5) return;
    //         enemies.slice(0, 1).forEach((enemy) => {
    //             if (enemy.ref && !enemy.ref.current.destroyed) {
    //                 enemy.ref.current.destroy({
    //                     children: true,
    //                     texture: true,
    //                     baseTexture: true,
    //                 });
    //             }
    //         });
    //         setEnemies((prevEnemies) => prevEnemies.slice(1)); // Remove the first enemy
    //     }, 2000);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <>
            {enemies.map((enemy) => (
                <EnemySprite
                    key={enemy.id}
                    textureUrl={enemy.textureUrl}
                    text={enemy.text}
                    textStyle={textStyle}
                    isRotating={isRotating}
                    x={enemy.x}
                    y={enemy.y}
                    scale={0.1}
                    ref={enemy.ref}
                />
            ))}
        </>
    );
};

export default RandomEnemySpawner;
