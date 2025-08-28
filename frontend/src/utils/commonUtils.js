import React from "react";
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
