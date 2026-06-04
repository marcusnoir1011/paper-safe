"use client";

import { Paperclip, PlusCircle, LayoutList } from "lucide-react";

import UploadDoc from "@/components/ui/UploadDoc";
import DocumentList from "@/components/ui/DocumentList";
import DashboardStats from "@/components/ui/DashboardStats";
import UserMenu from "@/components/ui/UserMenu";

interface DeskViewProps {
  visibleDocuments: any[];
  totalUnpaidAmount: number;
  overBillsCount: number;
  paidBillCount: number;
}

export default function DeskView({
  visibleDocuments,
  totalUnpaidAmount,
  overBillsCount,
  paidBillCount,
}: DeskViewProps) {
  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between bg-surface w-full border border-border-light p-4 rounded-2xl shadow-sm gap-3">
        <div className="flex items-center gap-3">
          <div className="p-4 bg-ink rounded-2xl shadow-sm border border-border-light shrink-0">
            <Paperclip className="text-white" size={48} />
          </div>
          <div className="flex flex-col justify-between self-stretch py-1">
            <h1 className="font-sans text-4xl font-bold text-slate-900 tracking-tight leading-none">
              Paper Safe
            </h1>
            <p className="font-mono text-sm font-medium mt-1 text-muted tracking-tighter">
              Keep those Japanese bills
              <br /> in check!
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          <UserMenu />
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center gap-3 text-slate-400">
          <PlusCircle size={20} />
          <h2 className="font-sans text-md font-bold uppercase tracking-wider">
            Upload
          </h2>
        </div>
        <UploadDoc />
      </section>

      <section className="space-y-3">
        <DashboardStats
          totalUnpaidAmount={totalUnpaidAmount}
          overdueDateCount={overBillsCount}
          paidBillCount={paidBillCount}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3 text-slate-400">
          <LayoutList size={20} />
          <h2 className="font-sans text-md font-bold text-slate-400 uppercase tracking-wider">
            Recent Documents
          </h2>
        </div>
        <DocumentList documents={visibleDocuments} />
      </section>
    </div>
  );
}
