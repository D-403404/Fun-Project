import React from "react";

const Input = (props) => {
    return (
        <input
            className="w-[300px] focus:outline-gray-100 p-2 bg-none border-gray-300 border-2 rounded-lg"
            {...props}
        />
    );
};

export default Input;
