import React from "react";
import LoginModal from "../components/LoginModal";

import GameCanvas from "../components/GameCanvas";
import SpaceShipSprite from "../components/sprites/SpaceShipSprite";
import LaserBeamSprite from "../components/sprites/LaserBeamSprite";

import useControls from "../utils/useControls";

export default function LoginPage() {
    const parentRef = React.useRef(null);
    const spaceShipRef = React.useRef(null);
    const laserBeamRef = React.useRef(null);

    const [counter, setCounter] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // React.useEffect(() => {
    //     window.addEventListener("keydown", (event) =>
    //         controlFn(event, spaceShipRef)
    //     );

    //     return () => {
    //         window.removeEventListener("keydown", controlFn);
    //     };
    // }, []);

    // useTick(() => controlFn(KeyboardEvent))

    

    return (
        <div
            className="h-screen text-white flex flex-col gap-4 items-center justify-center"
            ref={parentRef}
        >
            <p className="font-semibold select-none z-10">
                Arrow keys to move and ENTER to go to the next field
            </p>
            <LoginModal className="z-10" />
            <GameCanvas
                parentRef={parentRef}
                background={"/space-shooter/space-bg_medium.mp4"}
            >
                <SpaceShipSprite ref={spaceShipRef} controlFn={useControls} />
                <LaserBeamSprite
                    key={counter} // to re-render the sprite when counter changes
                    ref={laserBeamRef}
                    spaceShipRef={spaceShipRef}
                />
            </GameCanvas>
        </div>
    );
}
