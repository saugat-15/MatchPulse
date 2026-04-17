import React from 'react';
import Image from "next/image";
import Link from "next/link";
import NavItems from "@/components/NavItems";
import {NAV_ITEMS} from "@/lib/navItems";
import UserDropdown from "@/components/UserDropdown";

const Header = () => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image src="/assets/images/logo.png" alt="Logo" height={32} width={140} className="h-8 w-auto cursor-pointer" />
        </Link>
          <nav className="hidden sm:block">
          {/*  NavItems*/}
            <NavItems navItems={NAV_ITEMS} />
          </nav>
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;