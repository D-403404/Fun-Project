import React from "react";
import { cn } from "@/utils/commonUtils";

const SpinButton = ({ setValue, className }) => {
    const buttonRef = React.useRef(null);
    const animationFrameRef = React.useRef(null);
    const round = React.useRef(0); // use ref to avoid re-renders on every change

    const currentAngle = React.useRef(0); // current displayed angle
    const velocity = React.useRef(0); // angular velocity (deg/frame)
    const lastAngle = React.useRef(0); // last mouse angle
    const lastTime = React.useRef(0); // timestamp of last move
    const isDragging = React.useRef(false);

    const friction = 0.95; // friction factor for momentum decay

    const getMouseAngle = (e) => {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        let angleFromX = Math.atan2(mouseY - centerY, mouseX - centerX);
        return (angleFromX * 180) / Math.PI; // convert to degrees
    };

    // animation loop
    React.useEffect(() => {
        const animate = () => {
            const oldAngle = currentAngle.current;

            if (!isDragging.current) {
                // Apply friction when not dragging
                velocity.current *= friction;
                if (Math.abs(velocity.current) < 0.01) velocity.current = 0; // stop tiny values
                currentAngle.current += velocity.current;
            }

            if (buttonRef.current) {
                buttonRef.current.style.transform = `rotate(${currentAngle.current}deg)`;

                const diff =
                    Math.floor(currentAngle.current / 360) -
                    Math.floor(oldAngle / 360);
                if (diff) {
                    // If the angle has crossed a full rotation, increment the round counter
                    round.current += diff;
                    if (round.current < 0) round.current = 999;
                    if (round.current > 999) round.current = 0;
                    if (setValue) setValue(round.current);
                }
            }

            // console.log("Old angle:", oldAngle);
            // console.log("Current angle:", currentAngle.current);

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [setValue]);

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;

        const angle = getMouseAngle(e);
        const now = performance.now();
        const sensitivity = 2;

        // delta in angle
        let delta = angle - lastAngle.current;
        if (delta > 180) {
            delta -= 360;
            round.current = (round.current - 1 + 1000) % 1000;
            if (setValue) setValue(round.current);
        }
        if (delta < -180) {
            delta += 360;
            round.current = (round.current + 1) % 1000;
            if (setValue) setValue(round.current);
        }

        currentAngle.current += delta * sensitivity;

        // estimate velocity (deg/ms => scaled to per frame)
        // If frame is fast, velocity is high, so it takes more frames to slow down
        // If frame is slow, velocity is low, so it takes fewer frames to slow down
        const dt = now - lastTime.current || 16;
        velocity.current = (delta / dt) * 16; // normalize to ~60fps - 16ms per frame

        lastAngle.current = angle;
        lastTime.current = now;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (buttonRef.current) buttonRef.current.style.cursor = "grab";

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e) => {
        if (!buttonRef.current) return;
        isDragging.current = true;
        buttonRef.current.style.cursor = "grabbing";
        lastAngle.current = getMouseAngle(e);
        lastTime.current = performance.now();
        velocity.current = 0; // reset velocity

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <button
            ref={buttonRef}
            className={cn(
                "h-full aspect-square border-2 border-white rounded-full bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 cursor-grab",
                className
            )}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.preventDefault()}
        />
    );
};

export default SpinButton;
