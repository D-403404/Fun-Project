import React from "react";

import { Application, extend } from "@pixi/react";
import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";

// extend tells @pixi/react what Pixi.js components are available
extend({
    Assets,
    Container,
    Graphics,
    Sprite,
    Texture,
});

const GameCanvas = ({ parentRef, background, children }) => {
    const [backgroundTexture, setBackgroundTexture] = React.useState(null);

    React.useEffect(() => {
        if (background) {
            if (
                ["mp4", "mov", "mkv", "wmv"].includes(
                    background.split(".").pop()
                )
            ) {
                let video = document.createElement("video");
                video.preload = "auto";
                video.loop = true;
                video.autoplay = true;
                video.muted = true;
                video.src = background;

                video
                    .play()
                    .then(() => {
                        const texture = Texture.from(video);
                        setBackgroundTexture(texture);
                    })
                    .catch((err) => {
                        console.error("Video play error:", err);
                    });
            } else {
                Assets.load(background).then((texture) => {
                    setBackgroundTexture(texture);
                });
            }
        }
    }, [background]);

    return (
        <Application
            className="w-full h-full absolute top-0 left-0 bg-none"
            resizeTo={parentRef}
        >
            {/* background image as first child */}
            <pixiSprite
                texture={backgroundTexture}
                x={0}
                y={0}
                width={window.innerWidth}
                height={window.innerHeight}
            />
            {children}
        </Application>
    );
};

export default GameCanvas;
