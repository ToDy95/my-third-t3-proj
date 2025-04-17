"use client";

import React from "react";
import { useSession, SessionProvider, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/providers/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 flex w-full items-center justify-between border-b border-gray-300 bg-transparent p-4 backdrop-blur-md">
      {/* Left side - Categories */}

      <div className="flex gap-4">
        <>
          <Link href="/category1" className="hover:underline">
            Categ 1
          </Link>
          <Link href="/category2" className="hover:underline">
            Categ 2
          </Link>
          <Link href="/category3" className="hover:underline">
            Categ 3
          </Link>
        </>
      </div>

      {/* Right side - Theme Toggle & Avatar */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {session ? (
          <Popover>
            <PopoverTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={session?.user?.image ?? "https://github.com/shadcn.png"}
                  alt="User Avatar"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex flex-col justify-center gap-4">
                <div className="flex">
                  {session.user?.role === "ADMIN" && (
                    <Button
                      onClick={() => redirect("/admin-panel")}
                      variant="outline"
                      className="w-full"
                    >
                      Admin panel
                    </Button>
                  )}

                  {session.user?.role === "SELLER" && (
                    <Button
                      variant="outline"
                      onClick={() => redirect("/seller-panel")}
                      className="w-full"
                    >
                      Seller panel
                    </Button>
                  )}

                  {session.user?.role === "BUYER" && (
                    <Button
                      variant="outline"
                      onClick={() => redirect("/buyer-panel")}
                      className="w-full"
                    >
                      Buyer pannel
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="flex">
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </nav>
  );
};

const Navigation = () => {
  return (
    <SessionProvider>
      <Navbar />
    </SessionProvider>
  );
};

export default Navigation;
