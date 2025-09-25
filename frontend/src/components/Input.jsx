import React from "react";
import { cn } from "@/utils/commonUtils";

const Input = ({ id, label, errorMsg, className, ...props }) => {
    return (
        <div className="relative py-3 w-full">
            <input
                id={id}
                className={cn(
                    "peer w-full h-12 focus:border-purple-300 focus:border-4 box-border focus:outline-none p-3 bg-none border-gray-300 border-2 rounded-lg",
                    className
                )}
                placeholder=""
                {...props}
            />
            <label
                htmlFor={id}
                className={cn(
                    "peer absolute left-3 top-0 origin-left -translate-y-1/2 text-purple-300 transition-all duration-200",
                    // initial state when input is empty
                    "peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:cursor-text",
                    // when focused
                    "peer-focus:top-0 peer-focus:text-purple-300 peer-focus:-translate-y-1/2"
                )}
            >
                {label}
            </label>
            <p className="absolute -bottom-2 left-3 text-red-300 text-sub">
                {errorMsg}
            </p>
        </div>
    );
};

export default Input;
