import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { Ghost, PlusCircle, LayoutList } from "lucide-react";

import Auth from "@/components/Auth";
import UploadDoc from "@/components/UploadDoc";
import DocumentList from "@/components/DocumentList";
import DashboardStats from "@/components/DashboardStats";

export default async function Home() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  // auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="grid place-items-center min-h-screen bg-slate-50">
        <Auth />
      </main>
    );
  }

  // data for dashboard
  const { data: documents } = await supabase.from("documents").select("*");
  const unpaidBills = documents?.filter((doc) => !doc.is_paid);
  const totalUnpaidAmount = unpaidBills?.reduce(
    (sum, doc) => sum + (doc.amount || 0),
    0,
  );
  const overdueBills = unpaidBills?.filter((doc) => {
    if (!doc.due_date) return false;
    return new Date(doc.due_date) < new Date();
  });
  const overBillsCount = overdueBills?.length || 0;
  const paidBillCount = documents?.filter((doc) => doc.is_paid).length;

  return (
    <main className="max-w-xl mx-auto py-12 px-6 space-y-12">
      <header className="flex items-center gap-3">
        <div className="bg-blue-400 p-2 rounded–lg">
          <Ghost className="text-white" size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Anxiety vault
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Keep those Japanese bills in check!
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-slate-400">
          <PlusCircle size={18} />
          <h2 className="text-xs font-semibold uppercase tracking-wider">
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
        <div className="flex items-center gap-2 text-slate-400">
          <LayoutList size={18} />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Recent Documents
          </h2>
        </div>
        <DocumentList />
      </section>
    </main>
  );
}
