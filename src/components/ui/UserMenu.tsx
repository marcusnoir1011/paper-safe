"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Settings,
  KeyRound,
  UserX,
  ChevronLeft,
} from "lucide-react";

import { supabase } from "@/lib/client";

export default function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuView, setMenuView] = useState<"main" | "account">("main");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth");
  };

  const closeMenu = () => {
    setIsOpen(false);
    setMenuView("main");
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => {
          if (isOpen) closeMenu();
          else setIsOpen(true);
        }}
        className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-full bg-surface text-ink border border-border-light hover:border-ink transition focus:outline-none shadow-sm shrink-0 active:scale-95"
      >
        <User className="w-10 h-10 md:w-12 md:h-12 text-ink shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeMenu} />

          <div className="absolute right-1 mt-2 w-52 rounded-xl space-y-2 p-2 shadow-lg bg-surface border border-border-light ring-opacity-5 z-20">
            {menuView === "main" && (
              <>
                <div>
                  <button
                    onClick={() => setMenuView("account")}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans hover:ring-ink hover:ring-1 hover:shadow-md rounded-lg text-ink transition-colors active:bg-slate-50"
                  >
                    <Settings className="w-5 h-5 shrink-0" />
                    <span>Account</span>
                  </button>
                </div>

                <div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans hover:border-red-300 rounded-xl text-red-600 hover:bg-red-100"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="font-bold">Sign Out</span>
                  </button>
                </div>
              </>
            )}
            {menuView === "account" && (
              <>
                <div>
                  <button
                    onClick={() => setMenuView("main")}
                    className="flex items-center gap-1 w-full px-2 py-1 text-xs font-mono text-slate-400 hover:text-ink transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => {
                      closeMenu();
                      router.push("/account/change-password");
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans hover:ring-ink hover:ring-1 hover:shadow-md rounded-lg text-ink transition-colors active:bg-slate-50"
                  >
                    <KeyRound className="w-4 h-4 text-ink shrink-0" />
                    <span className="font-medium">Password</span>
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => {
                      closeMenu();
                      alert("Account Deletion coming soon!");
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans hover:ring-ink hover:ring-1 hover:shadow-md rounded-lg text-ink transition-colors active:bg-slate-50"
                  >
                    <UserX className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-bold">Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
