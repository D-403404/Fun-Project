import { useTick } from "@pixi/react";
import { Assets } from "pixi.js";
import React from "react";

const LaserBeamSprite = ({ ref, spaceShipRef }) => {
    const [texture, setTexture] = React.useState(null);
    const [position, setPosition] = React.useState({
        x: 0,
        y: 0,
    });
    const vx = 0; // Horizontal velocity, not used in this case
    const vy = -10; // Vertical velocity for the laser beam

    React.useEffect(() => {
        if (texture === null) {
            // Load the laser beam texture
            Assets.load("/space-shooter/laser-beam.png").then((result) => {
                setTexture(result);
            });
        }

        if (spaceShipRef.current) {
            // Update the position of the laser beam based on the spaceship's position
            setPosition({
                x: spaceShipRef.current.x,
                y: spaceShipRef.current.y - 50, // Adjust for the laser beam's offset
            });
        }
    }, [texture, spaceShipRef]);

    useTick((tickObj) => {
        setPosition((prevPosition) => ({
            x: prevPosition.x + vx * tickObj.deltaTime,
            y: prevPosition.y + vy * tickObj.deltaTime, // Move the laser beam upwards
        }));
        // console.log(delta, "Laser Beam Tick");
    });

    return (
        <pixiSprite
            ref={ref}
            texture={texture}
            x={position.x}
            y={position.y}
            anchor={0.5}
            rotation={Math.PI / 2} // Pointing upwards
            scale={0.05}
            visible={spaceShipRef.current}
        />
    );
};

export default LaserBeamSprite;
