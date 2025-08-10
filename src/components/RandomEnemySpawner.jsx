import React from "react";
import EnemySprite from "./sprites/EnemySprite";

const RandomEnemySpawner = ({
    textureUrlList = [],
    textList = [],
    maxEnemyNumber = 0,
}) => {
    const [enemies, setEnemies] = React.useState([]);
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
            const id = Math.random();
            const newEnemy = {
                id: id,
                textureUrl:
                    textureUrlList[
                        Math.floor(Math.random() * textureUrlList.length)
                    ],
                text: textList[Math.floor(Math.random() * textList.length)],
                x: (Math.random() * (0.9 - 0.1) + 0.1) * window.innerWidth,
                y: (Math.random() * (0.9 - 0.1) + 0.1) * window.innerHeight,
                ref: null, // Reference to the enemy sprite
            };
            setEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
            // console.log(newEnemy);

            // Give this enemy its own despawn time
            const despawnTime = Math.random() * (7000 - 3000) + 3000; // 3-7 seconds
            setTimeout(() => {
                setEnemies((prev) => {
                    const enemy = prev.find((e) => e.id === id);
                    if (enemy?.ref?.current && !enemy.ref.current.destroyed) {
                        enemy.ref.current.destroy({
                            children: true,
                            texture: true,
                            baseTexture: true,
                        });
                    }
                    return prev.filter((e) => e.id !== id);
                });
            }, despawnTime);
        }, 1000);

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
