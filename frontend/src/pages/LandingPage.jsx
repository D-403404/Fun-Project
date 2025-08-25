import React from "react";

import NavBar from "@/components/NavBar";
import ChromeDinoGame from "@/games/ChromeDinoGame";

export default function LandingPage() {
    const parentRef = React.useRef(null);
    return (
        <div
            ref={parentRef}
            className="relative h-screen text-black font-pixelifysans font-semibold text-xl"
        >
            <NavBar className="relative z-10" />
            <ChromeDinoGame parentRef={parentRef} />
        </div>
    );
}
