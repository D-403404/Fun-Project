import React from "react";

export const constructCharacterArray = () => {
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

export const removeEnemy = (id, setEnemies) => {
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
};

export const useCheat = (cheatCode = [], setCheatActive, bgmRef) => {
    const cheatSfx = React.useMemo(
        () => new Audio("windows-sounds/Windows XP Startup.mp3"),
        []
    );
    const cheatCodeLower = cheatCode.map((key) => key.toLowerCase());
    const cheatIndex = React.useRef(0);
    const checkCheatCode = React.useCallback(
        (e) => {
            if (e.key.toLowerCase() === cheatCodeLower[cheatIndex.current]) {
                cheatIndex.current++;
                if (cheatIndex.current === cheatCodeLower.length) {
                    setCheatActive(true);

                    let bgmVolume = bgmRef?.current?.volume || 0.0; // Get current volume or default to 1.0
                    if (bgmRef && bgmVolume > 0.1) bgmRef.current.volume = 0.1; // Lower the volume of the background music
                    cheatSfx.play();
                    cheatSfx.addEventListener(
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
};
