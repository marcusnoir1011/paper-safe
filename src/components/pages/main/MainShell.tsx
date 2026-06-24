"use client";

import { useState } from "react";

import NaviDock from "@/components/ui/NaviDock";
import DeskView from "./DeskView";
import VaultView from "./VaultView";

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
    <div className="w-full overflow-x-hidden max-w-2xl pb-28">
      {currentView === "desk" ? (
        <DeskView
          visibleDocuments={visibleDocuments}
          totalUnpaidAmount={totalUnpaidAmount}
          overBillsCount={overBillsCount}
          paidBillCount={paidBillCount}
        />
      ) : (
        <VaultView documents={visibleDocuments} />
      )}

      <NaviDock currentView={currentView} setView={setCurrentView} />
    </div>
  );
}
