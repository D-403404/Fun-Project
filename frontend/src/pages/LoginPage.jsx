import React from "react";
import { Howl, Howler } from "howler";
import LoginModal from "@/components/LoginModal";
import Button from "@/components/Button";

import GameCanvas from "@/components/2d-engine/GameCanvas";
import CharacterSprite from "@/components/2d-engine/sprites/CharacterSprite";
import ProjectileSprite from "@/components/2d-engine/sprites/ProjectileSprite";
import RandomEnemySpawner from "@/components/2d-engine/RandomEnemySpawner";

import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";

import useControls from "@/utils/useControls";
import {
    constructCharacterArray,
    useCheat,
    useCheckUserInteraction,
} from "@/utils/commonUtils";
import { useCollision } from "@/utils/collisionUtils";

import { LOGIN_CHEAT_CODE } from "@/data/cheat-codes";

export default function LoginPage() {
    const [interacted, setInteracted] = React.useState(false);

    useCheckUserInteraction(setInteracted);

    const [sfxActive, setSfxActive] = React.useState(true);
    const [bgmActive, setBgmActive] = React.useState(true);

    const parentRef = React.useRef(null);
    const spaceShipRef = React.useRef(null);
    const laserBeamRef = React.useRef(null);
    const [enemies, setEnemies] = React.useState([]);

    const usernameRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const [username, setUsername] = React.useState("");

    const cheatCode = LOGIN_CHEAT_CODE;
    const [cheatActive, setCheatActive] = React.useState(false);

    const textUpdate = (char) => {
        if (cheatActive) return;
        if (document.activeElement !== usernameRef.current) return;
        setUsername((prev) => prev + char.toLowerCase());
    };

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

    const [counter, setCounter] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (interacted) {
                setCounter((prev) => prev + 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [interacted]);

    const allChars = React.useMemo(() => {
        return constructCharacterArray();
    }, []);

    useCheat(cheatCode, setCheatActive, spaceBgm);

    useCollision(enemies, setEnemies, laserBeamRef, explosionSfx, textUpdate);

    return (
        <div
            className="relative h-screen text-white flex flex-col gap-4 items-center justify-center"
            ref={parentRef}
        >
            <p className="font-semibold select-none z-10">
                Arrow keys to move, BACKSPACE to delete and ENTER to go to the
                next field
            </p>
            <LoginModal
                username={username}
                setUsername={setUsername}
                usernameRef={usernameRef}
                passwordRef={passwordRef}
                cheatActive={cheatActive}
                className="z-10"
            />
            <div className="absolute top-2 left-2 text-white text-2xl grid grid-cols-2 grid-rows-2 gap-2 z-10">
                <>
                    <p>BGM</p>
                    <div>
                        <Button
                            isIcon
                            onClick={() => setBgmActive((prev) => !prev)}
                        >
                            {bgmActive ? <HiSpeakerWave /> : <HiSpeakerXMark />}
                        </Button>
                    </div>
                </>
                <>
                    <p>SFX</p>
                    <div>
                        <Button
                            isIcon
                            onClick={() => setSfxActive((prev) => !prev)}
                        >
                            {sfxActive ? <HiSpeakerWave /> : <HiSpeakerXMark />}
                        </Button>
                    </div>
                </>
            </div>
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
                    textList={allChars}
                    textureUrlList={["/space-shooter/meteor.png"]}
                    isRotating={true}
                    maxEnemyNumber={10}
                />
            </GameCanvas>
        </div>
    );
}
