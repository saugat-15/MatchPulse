import React from 'react';
import Link from "next/link";
import NavItems from "@/components/NavItems";
import { NAV_ITEMS } from "@/lib/navItems";
import UserDropdown from "@/components/UserDropdown";

const Header = () => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold text-white tracking-tight">
            Match<span className="text-yellow-500">Pulse</span>
          </span>
        </Link>
        <nav className="hidden sm:block">
          <NavItems navItems={NAV_ITEMS} />
        </nav>
        {/* <UserDropdown /> */}
      </div>
    </header>
  );
};

export default Header;
