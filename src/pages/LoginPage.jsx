import React from "react";
import LoginModal from "@/components/LoginModal";

import GameCanvas from "@/components/2d-engine/GameCanvas";
import CharacterSprite from "@/components/2d-engine/sprites/CharacterSprite";
import ProjectileSprite from "@/components/2d-engine/sprites/ProjectileSprite";

import useControls from "@/utils/useControls";
import RandomEnemySpawner from "@/components/2d-engine/RandomEnemySpawner";

const constructCharacterArray = () => {
    const uppercaseLetters = Array.from({ length: 26 }, (_, i) =>
        String.fromCharCode(65 + i)
    );

    const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

    // Define special characters you want to include
    const specialChars = [
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "-",
        "_",
        "+",
        "=",
    ];

    return [...uppercaseLetters, ...numbers, ...specialChars];
};

export default function LoginPage() {
    const parentRef = React.useRef(null);
    const spaceShipRef = React.useRef(null);
    const laserBeamRef = React.useRef(null);
    const [enemies, setEnemies] = React.useState([]);

    const usernameRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const [username, setUsername] = React.useState("");

    const textUpdate = (char) => {
        if (document.activeElement !== usernameRef.current) return;
        setUsername((prev) => prev + char.toLowerCase());
    };

    const laserSfx = React.useCallback(() => {
        const audio = new Audio("/space-shooter/sounds/laser-sfx.mp3");
        audio.volume = 0.1;
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
                    extraCollideFn={textUpdate}
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
