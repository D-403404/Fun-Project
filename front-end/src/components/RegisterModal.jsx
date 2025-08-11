import React from "react";

const RegisterModal = ({ className }) => {
    const usernameRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const nameRef = React.useRef(null);
    const ageRef = React.useRef(null);

    const [userData, setUserData] = React.useState({
        username: "",
        password: "",
        name: "",
        age: "",
    });

    return (
        <form
            className={`flex flex-col items-center justify-center bg-none border-white border-2 gap-8 p-8 rounded-lg shadow-lg ${className}`}
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Register data submitted");
            }}
        >
            <h2 className="text-2xl font-bold select-none">
                Register your new identity
            </h2>
            <div className="flex flex-col gap-4 select-none">
                <Input
                    ref={usernameRef}
                    type="text"
                    placeholder="Username"
                    onChange={(e) =>
                        setUserData((prev) => ({
                            username: e.target.value,
                            ...prev,
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
                            usernameRef.current.focus();
                        }
                    }}
                    onChange={(e) =>
                        setUserData((prev) => ({
                            password: e.target.value,
                            ...prev,
                        }))
                    }
                />
                <Input
                    ref={nameRef}
                    type="text"
                    placeholder="Name"
                    onChange={(e) =>
                        setUserData((prev) => ({
                            name: e.target.value,
                            ...prev,
                        }))
                    }
                />
                <Input
                    ref={ageRef}
                    type="number"
                    placeholder="Age"
                    onChange={(e) =>
                        setUserData((prev) => ({
                            age: e.target.value,
                            ...prev,
                        }))
                    }
                />
            </div>
            <Button type="submit">Login</Button>
        </form>
    );
};

export default RegisterModal;
