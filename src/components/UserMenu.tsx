"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";

import { supabase } from "@/lib/client";

export default function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth");
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center mb-2 w-10 h-10 rounded-full bg-surface text-ink border border-border-light hover:border-ink transition focus:outline-none"
      >
        <User className="w-5 h-5 text-ink" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 w-48 rounded-xl space-y-2 p-2 shadow-md bg-surface border border-border-light ring-opacity-5 z-20">
            <div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/account");
                }}
                className="flex items-center w-full px-4 py-2 text-sm font-sans hover:ring-ink hover:ring-1 hover:shadow-md rounded-lg text-ink transition-colors"
              >
                <Settings className="w-5 h-5" />
                Account Settings
              </button>
            </div>

            <div>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm font-sans hover:border-red-300 rounded-lg text-red-600 hover:bg-red-100"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
