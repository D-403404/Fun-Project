import React from "react";
import { Howl, Howler } from "howler";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Fisher–Yates shuffle algorithm (Durstenfeld's modernized version)
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function constructCharacterArray() {
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
}

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

//=======================CUSTOM HOOKS=======================//

export function useCheckUserInteraction(setInteracted) {
    React.useEffect(() => {
        const handleInteraction = () => {
            setInteracted(true);
            console.log(
                "User interaction detected, setting interacted state to true"
            );
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };

        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);

        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
    }, [setInteracted]);
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
