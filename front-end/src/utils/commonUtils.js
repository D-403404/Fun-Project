import React from "react";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
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

export function useBgm(audioRef) {
    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        function playAudio() {
            audio.play().catch(() => {
                // Play failed, maybe user hasn't interacted yet
            });
            window.removeEventListener("click", playAudio);
            window.removeEventListener("keydown", playAudio);
        }

        // Try playing once, then fallback to user interaction
        audio.play().catch(() => {
            window.addEventListener("click", playAudio);
            window.addEventListener("keydown", playAudio);
        });

        return () => {
            audio.pause();
            audio.currentTime = 0;
            window.removeEventListener("click", playAudio);
            window.removeEventListener("keydown", playAudio);
        };
    }, [audioRef]);
}

export function useCheat(cheatCode = [], setCheatActive, bgmRef) {
    const cheatSfx = React.useRef(
        new Audio("windows-sounds/Windows XP Startup.mp3")
    );
    const cheatCodeLower = cheatCode.map((key) => key.toLowerCase());
    const cheatIndex = React.useRef(0);
    const checkCheatCode = React.useCallback(
        (e) => {
            if (e.key.toLowerCase() === cheatCodeLower[cheatIndex.current]) {
                cheatIndex.current++;
                if (cheatIndex.current === cheatCodeLower.length) {
                    setCheatActive(true);

                    let bgmVolume = bgmRef.current.volume; // Get current volume or default to 1.0
                    if (bgmRef && bgmVolume > 0.1) bgmRef.current.volume = 0.1; // Lower the volume of the background music
                    cheatSfx.current.play();
                    cheatSfx.current.addEventListener(
                        "ended",
                        () => {
                            if (bgmRef) bgmRef.current.volume = bgmVolume; // Restore volume when cheatSfx ends
                        },
                        { once: true }
                    ); // Remove listener after it fires once

                    console.log("Cheat activated!");
                    cheatIndex.current = 0; // Reset cheat index
                }
            } else {
                cheatIndex.current = 0; // Reset if the sequence is broken
            }
        },
        [cheatCodeLower, setCheatActive, cheatSfx, bgmRef]
    );

    React.useEffect(() => {
        window.addEventListener("keydown", checkCheatCode);

        return () => window.removeEventListener("keydown", checkCheatCode);
    }, [checkCheatCode]);
}
