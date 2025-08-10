import { extend } from "@pixi/react";
import { Assets, Texture, Text } from "pixi.js";
import React from "react";

extend({ Assets, Texture, Text });

const EnemySprite = ({ textureUrl, text, textStyle, ...props }) => {
    const [texture, setTexture] = React.useState(Texture.EMPTY);
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (texture === Texture.EMPTY && textureUrl) {
            // Load the enemy texture
            Assets.load(textureUrl).then((result) => {
                setTexture(result);
            });
        }
    }, [texture, text, textureUrl, textStyle]);

    return (
        <pixiContainer ref={ref} x={props.x} y={props.y}>
            <pixiSprite texture={texture} anchor={0.5} scale={0.05} />
            <pixiText text={text} style={textStyle} anchor={0.5} />
        </pixiContainer>
    );
};

export default EnemySprite;
