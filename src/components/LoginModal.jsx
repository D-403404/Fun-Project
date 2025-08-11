import React from "react";
import Input from "./Input";
import Button from "./Button";

const LoginModal = ({
    username = "",
    setUsername,
    usernameRef,
    passwordRef,
    className,
}) => {
    const [userData, setUserData] = React.useState({
        username: username,
        password: "",
    });

    React.useEffect(() => {
        setUserData((prev) => ({
            username: username,
            password: prev.password,
        }));
    }, [username]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Login data submitted");
                console.log(userData);
            }}
            className={`flex flex-col items-center justify-center bg-none border-white border-2 gap-8 p-8 rounded-lg shadow-lg ${className}`}
        >
            <h2 className="text-2xl font-bold select-none">
                Enter your cridentials
            </h2>
            <div className="flex flex-col gap-4 select-none">
                <Input
                    ref={usernameRef}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") passwordRef.current.focus();
                        if (e.key != "Backspace") e.preventDefault();
                    }}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <Input
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    value={userData.password}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            usernameRef.current.focus();
                        }
                    }}
                    onChange={(e) =>
                        setUserData((prev) => ({
                            username: prev.username,
                            password: e.target.value,
                        }))
                    }
                />
            </div>
            <Button type="submit">Login</Button>
        </form>
    );
};

export default LoginModal;
