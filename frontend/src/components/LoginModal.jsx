import React from "react";
import { useFormContext } from "react-hook-form";

import Input from "./Input";
import Button from "./Button";

const LoginModal = ({
    usernameRef,
    passwordRef,
    cheatActive = false,
    className,
}) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useFormContext();

    const [_, setUserData] = React.useState({
        username: "",
        password: "",
    });

    const currUsername = watch("username", "");

    return (
        <form
            onSubmit={handleSubmit((data) => {
                setUserData(data);
                console.log("Login data submitted", data);
            })}
            className={`flex flex-col items-center justify-center bg-none border-white border-2 gap-6 p-6 rounded-lg shadow-lg ${className}`}
        >
            <h2 className="text-2xl font-bold select-none">
                Enter your cridentials
            </h2>
            <div className="w-full flex flex-col gap-6 select-none">
                <Input
                    id="username-input"
                    type="text"
                    label="Username"
                    errorMsg={errors.username?.message}
                    value={currUsername}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") passwordRef.current.focus();
                        if (!cheatActive && e.key !== "Backspace")
                            e.preventDefault();
                    }}
                    {...register("username", {
                        required: "Username is required",
                    })}
                    ref={(e) => {
                        register("username").ref(e); // this line is necessary to register the ref, so that any value changes are recorded by RHF
                        usernameRef.current = e; // assign to our own ref as well
                    }}
                />
                <Input
                    id="password-input"
                    type="password"
                    label="Password"
                    errorMsg={errors.password?.message}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            usernameRef.current.focus();
                        }
                    }}
                    {...register("password", {
                        required: "Password is required",
                    })}
                    ref={(e) => {
                        register("password").ref(e); // this line is necessary to register the ref, so that any value changes are recorded by RHF
                        passwordRef.current = e; // assign to our own ref as well
                    }}
                />
            </div>
            <Button type="submit" className="select-none">
                Login
            </Button>
        </form>
    );
};

export default LoginModal;
