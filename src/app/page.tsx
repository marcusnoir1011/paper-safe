import Auth from "@/components/Auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import UploadDoc from "@/components/UploadDoc";
import DocumentList from "@/components/DocumentList";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <Auth />
      </main>
    );
  }
  return (
    <main className="min-h-screen p-12 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">My Anxiety vault</h1>
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Upload New Bill Document
          </h2>
          <UploadDoc />
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Documents
          </h2>
          <DocumentList />
        </section>
      </div>
    </main>
  );
}
