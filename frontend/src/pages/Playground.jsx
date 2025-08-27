import React from "react";
import PhaserTestGame from "@/games/PhaserTestGame";

export default function Playground() {
    const phaserRef = React.useRef(null);
    return (
        <div>
            <PhaserTestGame ref={phaserRef} />
        </div>
    );
}
