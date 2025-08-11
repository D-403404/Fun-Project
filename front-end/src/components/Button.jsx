import React from "react";

const Button = ({ onClick, children }) => {
    return (
        <button
            className="w-full bg-none border-gray-300 border-2 p-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-300 cursor-pointer select-none"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
