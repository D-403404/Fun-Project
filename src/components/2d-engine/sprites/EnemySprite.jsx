import { extend, useTick } from "@pixi/react";
import { Assets, Texture, Text } from "pixi.js";
import React from "react";

extend({ Assets, Texture, Text });

const EnemySprite = ({
    ref,
    textureUrl,
    text,
    textStyle,
    isRotating,
    ...props
}) => {
    const spriteRef = React.useRef(null); // Create a ref for the sprite
    const [texture, setTexture] = React.useState(Texture.EMPTY);

    React.useEffect(() => {
        if (texture === Texture.EMPTY && textureUrl) {
            // Load the enemy texture
            Assets.load(textureUrl).then((result) => {
                setTexture(result);
            });
        }
    }, [texture, text, textureUrl, textStyle]);

    useTick((tickObj) => {
        if (isRotating && ref.current) {
            spriteRef.current.rotation += 0.01 * tickObj.deltaTime; // Rotate the enemy sprite
        }
    });

    return (
        <pixiContainer ref={ref} x={props.x} y={props.y}>
            <pixiSprite
                ref={spriteRef}
                texture={texture}
                anchor={0.5}
                scale={0.05}
            />
            <pixiText text={text} style={textStyle} anchor={0.5} />
        </pixiContainer>
    );
};

export default EnemySprite;
