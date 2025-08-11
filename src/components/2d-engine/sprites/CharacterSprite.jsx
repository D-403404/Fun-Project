import { Assets, Texture } from "pixi.js";
import React from "react";

const CharacterSprite = ({ ref, textureUrl, controlFn }) => {
    const [texture, setTexture] = React.useState(Texture.EMPTY);

    React.useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load(textureUrl).then((result) => {
                setTexture(result);
            });
        }
    }, [texture, textureUrl]);

    controlFn(ref);

    return (
        <pixiSprite
            ref={ref}
            texture={texture}
            x={window.innerWidth / 2}
            y={window.innerHeight - 50}
            anchor={0.5}
            scale={0.1}
            rotation={0}
            interactive={false}
        />
    );
};

export default CharacterSprite;
