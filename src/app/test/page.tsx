import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function TestPage() {
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

  const { data: documents, error } = await supabase
    .from("documents")
    .select("*");

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Database connection test</h1>
      {error ? (
        <p className="text-red-500 font-mono">Error: {error.message}</p>
      ) : (
        <p className="text-green-500">
          Success ! Connected to Supabase. Found {documents?.length}
        </p>
      )}
    </div>
  );
}
