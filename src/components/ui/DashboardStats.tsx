import { Wallet, AlertCircle, CheckCircle2 } from "lucide-react";

interface DashboardProps {
  totalUnpaidAmount: number;
  overdueDateCount: number;
  paidBillCount: number;
}

export default function DashboardStats({
  totalUnpaidAmount,
  overdueDateCount,
  paidBillCount,
}: DashboardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      {/*Red*/}
      <div
        className="bg-surface border border-border-light rounded-xl p-4 shadow-sm flex items-center gap-5 transition-shadow hover:shadow-md"
        id="totalUnpaidAmount"
      >
        <div className="bg-slate-100 p-4 rounded-lg text-ink">
          <Wallet size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted mb-1">
            Total UnPaid Bills
          </p>
          <h2 className="text-xl font-bold text-slate-900 tracking-light">
            ¥{totalUnpaidAmount.toLocaleString()}
          </h2>
        </div>
      </div>

      {/*Black*/}
      <div
        className="bg-surface border border-border-light rounded-xl p-4 shadow-sm flex items-center gap-5 transition-shadow hover:shadow-md"
        id="overdueDateCount"
      >
        <div className="bg-slate-100 p-4 rounded-lg text-ink">
          <AlertCircle size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted mb-1">
            Total Overdue Bills
          </p>
          <h2 className="text-xl font-bold text-slate-900 tracking-light">
            {overdueDateCount}
          </h2>
        </div>
      </div>

      {/*Green*/}
      <div
        className="bg-surface border border-border-light rounded-xl p-4 shadow-sm flex items-center gap-5 transition-shadow hover:shadow-md"
        id="paidBillCount"
      >
        <div className="bg-slate-100 p-4 rounded-lg text-ink">
          <CheckCircle2 />
        </div>
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted mb-1">
            Paid This Month
          </p>
          <h2 className="text-xl font-bold text-slate-900 tracking-light">
            {paidBillCount}
          </h2>
        </div>
      </div>
    </div>
  );
}
