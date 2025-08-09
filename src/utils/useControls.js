import React from "react";
import { useTick } from "@pixi/react";

function useControls(ref, speed = 10, invertControl = false) {
    // Booleans for pressed keys
    const left = React.useRef(false);
    const right = React.useRef(false);
    const up = React.useRef(false);
    const down = React.useRef(false);

    React.useEffect(() => {
        const onKeyDown = (e) => {
            switch (e.key.toLowerCase()) {
                case "arrowleft":
                case "a":
                    left.current = true;
                    break;
                case "arrowright":
                case "d":
                    right.current = true;
                    break;
                case "arrowup":
                case "w":
                    up.current = true;
                    break;
                case "arrowdown":
                case "s":
                    down.current = true;
                    break;
            }
        };

        const onKeyUp = (e) => {
            switch (e.key.toLowerCase()) {
                case "arrowleft":
                case "a":
                    left.current = false;
                    break;
                case "arrowright":
                case "d":
                    right.current = false;
                    break;
                case "arrowup":
                case "w":
                    up.current = false;
                    break;
                case "arrowdown":
                case "s":
                    down.current = false;
                    break;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useTick(() => {
        const object = ref.current;
        if (!object) return;

        let dx = 0,
            dy = 0;
        const velocity = invertControl ? -speed : speed;

        if (left.current) dx -= velocity;
        if (right.current) dx += velocity;
        if (up.current) dy -= velocity;
        if (down.current) dy += velocity;

        // Normalize diagonal speed
        if (dx !== 0 && dy !== 0) {
            const diagSpeed = velocity / Math.sqrt(2);
            dx = dx > 0 ? diagSpeed : -diagSpeed;
            dy = dy > 0 ? diagSpeed : -diagSpeed;
        }

        object.x = Math.max(0, Math.min(object.x + dx, window.innerWidth));
        object.y = Math.max(0, Math.min(object.y + dy, window.innerHeight));
    });
}

export default useControls;
