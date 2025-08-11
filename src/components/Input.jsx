import React from "react";

const Input = (props) => {
    return (
        <input
            className="w-80 h-12 focus:border-blue-300 focus:border-4 box-border focus:outline-none p-2 bg-none border-gray-300 border-2 rounded-lg"
            {...props}
        />
    );
};

export default Input;
