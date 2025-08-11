import React from "react";
import LoginModal from "@/components/LoginModal";

import GameCanvas from "@/components/2d-engine/GameCanvas";
import CharacterSprite from "@/components/2d-engine/sprites/CharacterSprite";
import ProjectileSprite from "@/components/2d-engine/sprites/ProjectileSprite";
import RandomEnemySpawner from "@/components/2d-engine/RandomEnemySpawner";

import useControls from "@/utils/useControls";
import { constructCharacterArray, useCheat } from "@/utils/commonUtils";

export default function LoginPage() {
    const parentRef = React.useRef(null);
    const spaceShipRef = React.useRef(null);
    const laserBeamRef = React.useRef(null);
    const [enemies, setEnemies] = React.useState([]);

    const usernameRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const [username, setUsername] = React.useState("");

    const cheatCode = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "B",
        "A",
        "Enter",
    ];
    const [cheatActive, setCheatActive] = React.useState(false);

    const textUpdate = (char) => {
        if (document.activeElement !== usernameRef.current) return;
        setUsername((prev) => prev + char.toLowerCase());
    };

    const spaceBgmRef = React.useRef(null);

    React.useEffect(() => {
        spaceBgmRef.current = new Audio(
            "/space-shooter/sounds/calm-space-music.mp3"
        );
        spaceBgmRef.current.loop = true;

        function playAudio() {
            spaceBgmRef.current.play().catch(() => {
                // Play failed, maybe user hasn't interacted yet
            });
            window.removeEventListener("click", playAudio);
            window.removeEventListener("keydown", playAudio);
        }

        // Try playing once, then fallback to user interaction
        spaceBgmRef.current.play().catch(() => {
            window.addEventListener("click", playAudio);
            window.addEventListener("keydown", playAudio);
        });

        return () => {
            spaceBgmRef.current.pause();
            spaceBgmRef.current.currentTime = 0;
            window.removeEventListener("click", playAudio);
            window.removeEventListener("keydown", playAudio);
        };
    }, []);

    // useMemo will have long pause between sounds => useCallback instead
    const laserSfx = React.useCallback(() => {
        const audio = new Audio("/space-shooter/sounds/laser-sfx.mp3");
        audio.volume = 0.5;
        return audio;
    }, []);

    const [counter, setCounter] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => prev + 1);
            laserSfx().play();
        }, 1000);

        return () => clearInterval(interval);
    }, [laserSfx]);

    const allChars = React.useMemo(() => {
        return constructCharacterArray();
    }, []);

    useCheat(cheatCode, setCheatActive, spaceBgmRef);

    return (
        <div
            className="h-screen text-white flex flex-col gap-4 items-center justify-center"
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
            <GameCanvas
                parentRef={parentRef}
                background={"/space-shooter/space-bg_medium.mp4"}
            >
                <CharacterSprite
                    ref={spaceShipRef}
                    textureUrl="/space-shooter/space-ship.png"
                    controlFn={useControls}
                />
                <ProjectileSprite
                    key={counter} // to re-render the sprite when counter changes
                    ref={laserBeamRef}
                    shooterRef={spaceShipRef}
                    enemies={enemies}
                    setEnemies={setEnemies}
                    extraCollideFn={cheatActive ? () => {} : textUpdate}
                    textureUrl="/space-shooter/laser-beam.png"
                />
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
