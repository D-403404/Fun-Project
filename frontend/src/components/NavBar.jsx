import React from "react";
import { cn } from "@/utils/commonUtils";

const leftNavItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Credits", href: "/credits" },
];

const rightNavItems = [
    { name: "Log In", href: "/login" },
    { name: "Sign Up", href: "/register" },
];

const NavBar = ({ className }) => {
    return (
        <nav
            className={cn(
                "flex justify-between items-center px-8 py-4",
                className
            )}
        >
            <ul className="flex gap-4">
                {leftNavItems.map((item) => (
                    <li key={item.name}>
                        <a
                            href={item.href}
                            className="hover:text-gray-400 rounded-xl p-2"
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
            <ul className="flex gap-4">
                {rightNavItems.map((item) => (
                    <li key={item.name}>
                        <a
                            href={item.href}
                            className="hover:text-gray-400 rounded-xl p-2"
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;
