import React from "react";

import NavBar from "@/components/NavBar";
import ChromeDinoGame from "@/games/ChromeDinoGame";

export default function LandingPage() {
    return (
        <div className="relative h-screen text-medium-grey font-pixelifysans font-semibold text-xl">
            <NavBar className="relative z-10" />
            <div id="game-container">
                <ChromeDinoGame />
            </div>
        </div>
    );
}
