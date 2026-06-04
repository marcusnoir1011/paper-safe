"use client";

import { Inbox, Vault } from "lucide-react";

interface NaviDockProps {
  currentView: "desk" | "vault";
  setView: (view: "desk" | "vault") => void;
}

export default function NaviDock({ currentView, setView }: NaviDockProps) {
  return (
    <div className="fixed flex justify-center bottom-8 left-4 right-4 z-40 pointer-events-none">
      <div className="flex items-center justify-between gap-3 p-2 bg-surface/90 backdrop-blur-md rounded-xl shadow-lg max-w-xs w-full pointer-events-auto">
        <button
          onClick={() => setView("desk")}
          className={`
          flex flex-1 items-center justify-center rounded-xl gap-2 py-4 md:py-2 text-sm font-bold transition-all active:scale-95
          ${currentView === "desk" ? "bg-ink text-white shadow-md" : "text-slate-400 hover:text-ink active:bg-slate-100"}
          `}
        >
          <Inbox className="w-6 h-6 shrink-0" />
          <span className="font-bold">Desk</span>
        </button>
        <button
          onClick={() => setView("vault")}
          className={`
          flex flex-1 items-center justify-center rounded-xl gap-2 py-4 md:py-2 text-sm font-bold transition-all active:scale-95
          ${currentView === "vault" ? "bg-ink text-white shadow-md" : "text-slate-400 hover:text-ink active:bg-slate-100"}
          `}
        >
          <Vault className="w-6 h-6 shrink-0" />
          <span className="font-bold">Vault</span>
        </button>
      </div>
    </div>
  );
}
