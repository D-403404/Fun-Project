import React from "react";

import NavBar from "@/components/NavBar";
import ChromeDinoGame from "@/games/ChromeDinoGame";

export default function LandingPage() {
    return (
        <div className="relative h-screen text-chrome-dino-grey font-pixelifysans font-semibold text-xl">
            <NavBar className="relative z-10" />
            <div
                id="game-container"
                className="absolute top-0 left-0 w-full h-full bg-chrome-dino-white"
            >
                <ChromeDinoGame />
            </div>
        </div>
    );
}
