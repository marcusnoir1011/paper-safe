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
  LogOutIcon,
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
        className="flex items-center justify-center mb-2 w-10 h-10 rounded-full bg-surface text-ink border border-border-light hover:border-ink transition focus:outline-none"
      >
        <User className="w-5 h-5 text-ink" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeMenu} />

          <div className="absolute right-0 w-48 rounded-xl space-y-2 p-2 shadow-md bg-surface border border-border-light ring-opacity-5 z-20">
            {menuView === "main" && (
              <>
                <div>
                  <button
                    onClick={() => setMenuView("account")}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans hover:ring-ink hover:ring-1 hover:shadow-md rounded-lg text-ink transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Account</span>
                  </button>
                </div>

                <div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans hyover:border-red-300 rounded-lx text-red-600 hover:bg-red-100"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
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
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans hover:rign-ink hover:ring-1 hover:shadow-md rounded-lg text-ink transition-colors"
                  >
                    <KeyRound className="w-5 h-5" />
                    <span>Password</span>
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => {
                      closeMenu();
                      alert("Account Deletion coming soon!");
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans hover:ring-ink hover:ring-1 hover:shadow-md rounded-lg text-ink transition-colors"
                  >
                    <UserX className="w-5 h-5" />
                    <span>Delete</span>
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
