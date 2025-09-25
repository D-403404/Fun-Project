import React from "react";
import { useForm } from "react-hook-form";

import Input from "./Input";
import Button from "./Button";
import SpinButton from "./SpinButton";

const RegisterModal = ({ className }) => {
    const {
        register,
        setValue,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm();

    const usernameRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const nameRef = React.useRef(null);
    const ageRef = React.useRef(null);

    const [_, setUserData] = React.useState({
        username: "",
        password: "",
        name: "",
        age: 0,
    });

    const age = watch("age", 0);

    return (
        <form
            className={`flex flex-col items-center justify-center bg-none border-white border-2 gap-6 p-8 rounded-lg shadow-lg ${className}`}
            onSubmit={handleSubmit((data) => {
                setUserData(data);
                console.log("Register data submitted", data);
            })}
        >
            <h2 className="text-2xl font-bold select-none">
                Register your new identity
            </h2>
            <div className="w-full flex flex-col gap-4 select-none">
                <Input
                    id="username-input"
                    type="text"
                    label="Username"
                    errorMsg={errors.username?.message}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            passwordRef.current.focus();
                        }
                    }}
                    {...register("username", {
                        required: "Username is required",
                        minLength: {
                            value: 3,
                            message: "Username must be at least 3 characters",
                        },
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
                            nameRef.current.focus();
                        }
                    }}
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                    ref={(e) => {
                        register("password").ref(e); // this line is necessary to register the ref, so that any value changes are recorded by RHF
                        passwordRef.current = e; // assign to our own ref as well
                    }}
                />
                <Input
                    id="name-input"
                    type="text"
                    label="Name"
                    errorMsg={errors.name?.message}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            usernameRef.current.focus();
                        }
                    }}
                    {...register("name", {
                        required: "Name is required",
                        minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                        },
                    })}
                    ref={(e) => {
                        register("name").ref(e); // this line is necessary to register the ref, so that any value changes are recorded by RHF
                        nameRef.current = e; // assign to our own ref as well
                    }}
                />
                <div className="w-full flex gap-4">
                    <Input
                        id="age-input"
                        type="text"
                        disabled
                        value={age}
                        {...register("age")}
                        ref={ageRef} // age is read-only, so it's fine to just assign the ref directly
                    />
                    <SpinButton
                        setValue={(value) =>
                            setValue("age", value, {
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                        }
                    />
                </div>
            </div>
            <Button type="submit">Register</Button>
        </form>
    );
};

export default RegisterModal;
