import React from "react";

import NavBar from "@/components/NavBar";
import ChromeDinoGame from "@/games/ChromeDinoGame";

export default function LandingPage() {
    return (
        <div className="">
            <NavBar />
            <ChromeDinoGame />
        </div>
    );
}
