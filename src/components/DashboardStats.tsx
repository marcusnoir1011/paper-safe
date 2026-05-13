import { Wallet, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default function DashboardStats({
  totalUnpaidAmount,
  overdueDateCount,
  paidBillCount,
}: any) {
  return (
    <>
      {/*Red*/}
      <div id="totalUnpaidAmount">
        <Wallet />
        <p>Total UnPaid Bills</p>
        <h2>¥{totalUnpaidAmount.toLocaleString()}</h2>
      </div>

      {/*Black*/}
      <div id="overdueDateCount">
        <AlertCircle />
        <div>
          <p>Total Overdue Bills</p>
          <h2>{overdueDateCount}</h2>
        </div>
      </div>

      {/*Green*/}
      <div id="paidBillCount">
        <CheckCircle2 />
        <div>
          <p>Paid This Month</p>
          <h2>{paidBillCount}</h2>
        </div>
      </div>
    </>
  );
}
