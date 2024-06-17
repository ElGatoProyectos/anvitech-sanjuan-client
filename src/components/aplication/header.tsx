"use client";

import { signOut, useSession } from "next-auth/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CircleUserRound } from "lucide-react";

function Header() {
  const { data: session } = useSession();

  function handleLogout() {
    signOut();
  }

  return (
    <header className="w-full bg-white py-2 px-2 min-h-16">
      <Dialog>
        <nav className="w-full flex justify-end">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span>{session?.user.username}</span>
              <span className="text-sm text-slate-600">
                {session?.user.role}
              </span>
            </div>

            <DialogTrigger asChild>
              <CircleUserRound
                role="button"
                size={32}
                className="text-slate-600"
              />
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Sesion de usuario</DialogTitle>
              </DialogHeader>
              <div className="w-full flex flex-col gap-4"></div>
              <DialogFooter className="justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleLogout}
                  >
                    Cerrar sesion
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </div>
        </nav>
      </Dialog>
    </header>
  );
}

export default Header;
