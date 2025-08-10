import React from "react";
import Input from "./Input";
import Button from "./Button";

const LoginModal = ({ className }) => {
    return (
        <div
            className={`flex flex-col items-center justify-center bg-black/30 gap-8 p-8 rounded-lg shadow-lg ${className}`}
        >
            <h2 className="text-2xl font-bold select-none">
                Enter your cridentials
            </h2>
            <div className="flex flex-col gap-4">
                <Input type="text" placeholder="Username" />
                <Input type="password" placeholder="Password" />
            </div>
            <Button onClick={() => console.log("Login clicked!")}>Login</Button>
        </div>
    );
};

export default LoginModal;
