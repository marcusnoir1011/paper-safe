import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { Paperclip, PlusCircle, LayoutList } from "lucide-react";

import Auth from "@/app/auth/page";
import UploadDoc from "@/components/UploadDoc";
import DocumentList from "@/components/DocumentList";
import DashboardStats from "@/components/DashboardStats";
import UserMenu from "@/components/UserMenu";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  // auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Auth />;
  }

  // data for dashboard
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
  const safeDocuments = documents || [];

  const docsWithUrls = await Promise.all(
    safeDocuments.map(async (doc) => {
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.image_path, 3600);

      return { ...doc, signedUrl: data?.signedUrl };
    }),
  );

  const visibleDocuments = docsWithUrls.filter(
    (doc) => doc.is_visible !== false,
  );

  const unpaidBills = safeDocuments?.filter((doc) => !doc.is_paid);
  const totalUnpaidAmount = unpaidBills?.reduce(
    (sum, doc) => sum + (doc.amount || 0),
    0,
  );
  const overdueBills = unpaidBills?.filter((doc) => {
    if (!doc.due_date) return false;
    return new Date(doc.due_date) < new Date();
  });
  const overBillsCount = overdueBills?.length || 0;
  const paidBillCount = safeDocuments?.filter((doc) => doc.is_paid).length;

  return (
    <main className="max-w-xl mx-auto py-12 px-6 space-y-12">
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
    </main>
  );
}
