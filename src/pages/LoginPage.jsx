import React from "react";
import LoginModal from "../components/LoginModal";

import GameCanvas from "../components/GameCanvas";
import SpaceShipSprite from "../components/sprites/SpaceShipSprite";
import { BunnySprite } from "../components/sprites/BunnySprite";

export default function LoginPage() {
  const parentRef = React.useRef(null);
    return (
        <div className="h-screen text-white flex flex-col gap-4 items-center justify-center" ref={parentRef}>
            <p className="font-semibold select-none z-10">
                Arrow keys to move and ENTER to go to the next field
            </p>
            <LoginModal className="z-10" />
            <GameCanvas parentRef={parentRef} background={"/space-bg_medium.mp4"}>
                <SpaceShipSprite />
            </GameCanvas>
        </div>
    );
}
