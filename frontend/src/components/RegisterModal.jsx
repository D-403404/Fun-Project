import React from "react";
import Input from "./Input";
import Button from "./Button";
import SpinButton from "./SpinButton";

const RegisterModal = ({ className }) => {
    const usernameRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const nameRef = React.useRef(null);
    const ageRef = React.useRef(null);

    const [userData, setUserData] = React.useState({
        username: "",
        password: "",
        name: "",
        age: 0,
    });

    return (
        <form
            className={`flex flex-col items-center justify-center bg-none border-white border-2 gap-8 p-8 rounded-lg shadow-lg ${className}`}
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Register data submitted", userData);
            }}
        >
            <h2 className="text-2xl font-bold select-none">
                Register your new identity
            </h2>
            <div className="w-full flex flex-col gap-4 select-none">
                <Input
                    ref={usernameRef}
                    type="text"
                    placeholder="Username"
                    value={userData.username}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            passwordRef.current.focus();
                        }
                    }}
                    onChange={(e) =>
                        setUserData((prev) => ({
                            ...prev,
                            username: e.target.value,
                        }))
                    }
                />
                <Input
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    value={userData.password}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            nameRef.current.focus();
                        }
                    }}
                    onChange={(e) =>
                        setUserData((prev) => ({
                            ...prev,
                            password: e.target.value,
                        }))
                    }
                />
                <Input
                    ref={nameRef}
                    type="text"
                    placeholder="Name"
                    value={userData.name}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            usernameRef.current.focus();
                        }
                    }}
                    onChange={(e) =>
                        setUserData((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                />
                <div className="w-full flex gap-2">
                    <Input
                        ref={ageRef}
                        type="text"
                        placeholder="Age"
                        disabled
                        value={userData.age}
                    />
                    <SpinButton
                        setValue={(value) =>
                            setUserData((prev) => ({ ...prev, age: value }))
                        }
                    />
                </div>
            </div>
            <Button type="submit">Register</Button>
        </form>
    );
};

export default RegisterModal;
