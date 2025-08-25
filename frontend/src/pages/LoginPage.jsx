import React from "react";

import LoginModal from "@/components/LoginModal";
import Button from "@/components/Button";

import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";

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
                    <p className="flex items-center">BGM</p>
                    <div className="flex items-center">
                        <Button
                            isIcon
                            onClick={() => setBgmActive((prev) => !prev)}
                        >
                            {bgmActive ? <HiSpeakerWave /> : <HiSpeakerXMark />}
                        </Button>
                    </div>
                </>
                <>
                    <p className="flex items-center">SFX</p>
                    <div className="flex items-center">
                        <Button
                            isIcon
                            onClick={() => setSfxActive((prev) => !prev)}
                        >
                            {sfxActive ? <HiSpeakerWave /> : <HiSpeakerXMark />}
                        </Button>
                    </div>
                </>
            </div>
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
