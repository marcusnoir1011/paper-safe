import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import MainShell from "@/components/pages/main/MainShell";
import { redirect } from "next/navigation";

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
    redirect("/auth");
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

      return { ...doc, signedUrl: data?.signedUrl || null };
    }),
  );

  const visibleDocuments = docsWithUrls.filter(
    (doc) => doc.is_visible !== false,
  );

  const unpaidBills = safeDocuments.filter((doc) => !doc.is_paid);

  const totalUnpaidAmount = unpaidBills.reduce(
    (sum, doc) => sum + (doc.amount || 0),
    0,
  );
  const overdueBills = unpaidBills?.filter((doc) => {
    if (!doc.due_date) return false;
    return new Date(doc.due_date) < new Date();
  });

  const overBillsCount = overdueBills.length || 0;
  const paidBillCount = safeDocuments.filter((doc) => doc.is_paid).length;

  return (
    <main className="max-w-2xl w-full mx-auto py-12 px-6">
      <MainShell
        visibleDocuments={visibleDocuments}
        totalUnpaidAmount={totalUnpaidAmount}
        overBillsCount={overBillsCount}
        paidBillCount={paidBillCount}
      />
    </main>
  );
}
