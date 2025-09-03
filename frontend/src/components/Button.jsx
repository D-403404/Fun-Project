import React from "react";
import { cn } from "@/utils/commonUtils";

const Button = ({ isIcon = false, onClick, className, children }) => {
    return (
        <button
            className={cn(
                !isIcon &&
                    "w-full bg-none border-gray-300 border-2 p-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-300",
                "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;

import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";

export const AudioButtonGrid = ({ className, children }) => {
    return (
        <div
            className={cn(
                "absolute top-2 left-2 text-white text-2xl grid grid-cols-2 grid-rows-1 gap-2 z-10",
                className
            )}
        >
            {children}
        </div>
    );
};

export const AudioButton = ({ audioName, audioActive, setAudioActive }) => {
    return (
        <>
            <p className="flex items-center">{audioName}</p>
            <div className="flex items-center">
                <Button isIcon onClick={() => setAudioActive((prev) => !prev)}>
                    {audioActive ? <HiSpeakerWave /> : <HiSpeakerXMark />}
                </Button>
            </div>
        </>
    );
};
