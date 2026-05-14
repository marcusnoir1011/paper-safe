import { Wallet, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default function DashboardStats({
  totalUnpaidAmount,
  overdueDateCount,
  paidBillCount,
}: any) {
  return (
    <div className="flex items-center justify-between gap-3">
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
