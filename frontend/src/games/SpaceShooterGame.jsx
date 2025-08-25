import React from "react";
import { Howl, Howler } from "howler";

import GameCanvas from "@/components/2d-engine/GameCanvas";
import CharacterSprite from "@/components/2d-engine/sprites/CharacterSprite";
import ProjectileSprite from "@/components/2d-engine/sprites/ProjectileSprite";
import RandomEnemySpawner from "@/components/2d-engine/RandomEnemySpawner";

import useControls from "@/utils/useControls";
import { useCollision } from "@/utils/collisionUtils";
import { useCheckUserInteraction, useCheat } from "@/utils/commonUtils";

const SpaceShooterGame = ({
    parentRef,
    sfxActive,
    bgmActive,
    enemyTextList,
    collideFn,
    cheatCode,
    setCheatActive,
}) => {
    const [interacted, setInteracted] = React.useState(false);

    useCheckUserInteraction(setInteracted);

    const spaceShipRef = React.useRef(null);
    const laserBeamRef = React.useRef(null);
    const [enemies, setEnemies] = React.useState([]);

    const [counter, setCounter] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (interacted) {
                setCounter((prev) => prev + 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [interacted]);

    const spaceBgm = React.useMemo(() => {
        const audio = new Howl({
            src: ["/space-shooter/sounds/calm-space-music.mp3"],
            html5: true,
            loop: true,
            volume: 1.0,
            onload: () => spaceBgm.play(),
        });
        console.log("BGM created");
        return audio;
    }, []);

    const laserSfx = React.useMemo(
        () =>
            new Howl({
                src: ["/space-shooter/sounds/laser-sfx.mp3"],
                volume: 0.5,
            }),
        []
    );

    const explosionSfx = React.useMemo(
        () =>
            new Howl({
                src: ["/space-shooter/sounds/explosion-312361.mp3"],
                volume: 1.0,
            }),
        []
    );

    React.useEffect(() => {
        if (sfxActive) {
            laserSfx.mute(false);
            explosionSfx.mute(false);
        } else {
            laserSfx.mute(true);
            explosionSfx.mute(true);
        }
    }, [sfxActive, laserSfx, explosionSfx]);

    React.useEffect(() => {
        if (bgmActive) spaceBgm.mute(false);
        else spaceBgm.mute(true);
    }, [bgmActive, spaceBgm]);

    useCheat(cheatCode, setCheatActive, spaceBgm);

    useCollision(enemies, setEnemies, laserBeamRef, explosionSfx, collideFn);

    return (
        <GameCanvas
            parentRef={parentRef}
            background={"/space-shooter/space-bg_medium.mp4"}
        >
            <CharacterSprite
                ref={spaceShipRef}
                textureUrl="/space-shooter/space-ship.png"
                controlFn={useControls}
            />
            {interacted && (
                <ProjectileSprite
                    key={counter} // to re-render the sprite when counter changes
                    ref={laserBeamRef}
                    shooterRef={spaceShipRef}
                    sfx={laserSfx}
                    textureUrl="/space-shooter/laser-beam.png"
                    sfxActive={sfxActive}
                />
            )}
            <RandomEnemySpawner
                enemies={enemies}
                setEnemies={setEnemies}
                textList={enemyTextList}
                textureUrlList={["/space-shooter/meteor.png"]}
                isRotating={true}
                maxEnemyNumber={10}
            />
        </GameCanvas>
    );
};

export default SpaceShooterGame;
