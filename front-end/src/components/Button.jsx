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
