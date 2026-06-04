"use client";

import { useState } from "react";

import NaviDock from "@/components/ui/NaviDock";
import DeskView from "./DeskView";

interface MainShellProps {
  visibleDocuments: any[];
  totalUnpaidAmount: number;
  overBillsCount: number;
  paidBillCount: number;
}

export default function MainShell({
  visibleDocuments,
  totalUnpaidAmount,
  overBillsCount,
  paidBillCount,
}: MainShellProps) {
  const [currentView, setCurrentView] = useState<"desk" | "vault">("desk");
  return (
    <div>
      {currentView === "desk" ? (
        <DeskView
          visibleDocuments={visibleDocuments}
          totalUnpaidAmount={totalUnpaidAmount}
          overBillsCount={overBillsCount}
          paidBillCount={paidBillCount}
        />
      ) : (
        <div className="text-center py-20 text-slate-400 font-mono text-lg">
          Vault Coming Soon!
        </div>
      )}

      <NaviDock currentView={currentView} setView={setCurrentView} />
    </div>
  );
}
