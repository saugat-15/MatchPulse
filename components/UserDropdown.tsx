"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";
import { NAV_ITEMS } from "@/lib/navItems";

const UserDropdown = () => {
    const router = useRouter();

    const handleSignOut = () => {
        router.push("/sign-in");
    }

    const user = { name: "Saugat", email: "saugat@test.com" }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">{user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start justify-center ml-2">
                        <span className="text-base font-medium text-gray-400">{user?.name}</span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56 mr-2" align="start">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">{user?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-base font-medium text-gray-400">{user?.name}</span>
                            <span className="text-sm text-gray-400">{user?.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator className="block sm:hidden" />
                <nav className="sm:hidden">
                    <NavItems navItems={NAV_ITEMS} />
                </nav>
            </DropdownMenuContent>

        </DropdownMenu>
    );
};

export default UserDropdown;