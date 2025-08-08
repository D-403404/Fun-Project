import { Assets, Texture } from "pixi.js";
import React from "react";

const SpaceShipSprite = () => {
    const spriteRef = React.useRef(null);
    const [texture, setTexture] = React.useState(Texture.EMPTY);

    React.useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load("/space-ship.png").then((result) => {
                setTexture(result);
            });
        }
    }, [texture]);

    return (
        <pixiSprite
            ref={spriteRef}
            texture={texture}
            x={window.innerWidth / 2}
            y={window.innerHeight - 50}
            anchor={0.5}
            scale={0.1}
            rotation={0}
            interactive={true}
            buttonMode={true}
        />
    );
};

export default SpaceShipSprite;
