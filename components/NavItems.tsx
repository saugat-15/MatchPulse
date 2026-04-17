"use client"
import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const NavItems = ({ navItems }: { navItems: NavItem[] }) => {
    const pathName = usePathname();

    const isActive = (path: string) => {
        if (path === "/") return pathName === "/";
        return pathName.startsWith(path);
    };

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {navItems?.map(({ href, label }) => (
                <li key={href}>
                    <Link
                        href={href}
                        className={`hover:text-yellow-500 text-sm transition-colors ${isActive(href) ? "text-gray-100" : ""}`}
                    >
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default NavItems;
