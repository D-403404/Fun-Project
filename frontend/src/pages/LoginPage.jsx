import React from "react";

import LoginModal from "@/components/LoginModal";
import { AudioButton, AudioButtonGrid } from "@/components/Button";

import { constructCharacterArray } from "@/utils/commonUtils";

import { LOGIN_CHEAT_CODE } from "@/data/cheat-codes";

import SpaceShooterGame from "@/games/SpaceShooterGame";

export default function LoginPage() {
    const [sfxActive, setSfxActive] = React.useState(true);
    const [bgmActive, setBgmActive] = React.useState(true);

    const parentRef = React.useRef(null);
    const usernameRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const [username, setUsername] = React.useState("");

    const [cheatActive, setCheatActive] = React.useState(false);

    const textUpdate = (char) => {
        if (cheatActive) return;
        if (document.activeElement !== usernameRef.current) return;
        setUsername((prev) => prev + char.toLowerCase());
    };

    const allChars = React.useMemo(() => {
        return constructCharacterArray();
    }, []);

    return (
        <div
            className="relative h-screen text-white font-pixelifysans flex flex-col gap-4 items-center justify-center"
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
            <AudioButtonGrid>
                <AudioButton
                    audioName="BGM"
                    audioActive={bgmActive}
                    setAudioActive={setBgmActive}
                />
                <AudioButton
                    audioName="SFX"
                    audioActive={sfxActive}
                    setAudioActive={setSfxActive}
                />
            </AudioButtonGrid>
            <SpaceShooterGame
                parentRef={parentRef}
                sfxActive={sfxActive}
                bgmActive={bgmActive}
                enemyTextList={allChars}
                collideFn={textUpdate}
                cheatCode={LOGIN_CHEAT_CODE}
                setCheatActive={setCheatActive}
            />
        </div>
    );
}
