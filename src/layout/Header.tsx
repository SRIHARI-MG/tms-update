import React from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import companyLogo from "@/assets/CompanyLogo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="border-b-2">
      <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger className="mr-2 md:hidden">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col space-y-4 mt-6">
                <Link
                  to="/profile"
                  className="px-3 py-2 text-md font-semibold text-primary hover:bg-primary/10 rounded-sm"
                >
                  Profile
                </Link>
                <Link
                  to="/jobs"
                  className="px-3 py-2 text-md font-semibold text-primary hover:bg-primary/10 rounded-sm"
                >
                  Jobs
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={companyLogo}
              alt="Mindgraph"
              className="h-8 w-20 md:h-10 md:w-24"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ThemeToggle />
          <button className="relative">
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm">
                  <p className="font-medium">John Doe</p>
                  <p className="text-muted-foreground">User</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <nav className="hidden md:block border-t-2 h-14 px-10">
        <div className="flex gap-8 items-center h-full">
          <Link
            to="/profile"
            className="px-3 py-1 text-md font-semibold text-primary hover:border rounded-sm hover:border-primary hover:bg-primary/10"
          >
            Profile
          </Link>
          <Link
            to="/jobs"
            className="px-3 py-1 text-md font-semibold text-primary hover:border rounded-sm hover:border-primary hover:bg-primary/10"
          >
            Jobs
          </Link>
        </div>
      </nav>
    </header>
  );
}
