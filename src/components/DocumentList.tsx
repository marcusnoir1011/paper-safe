import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function DocumentList() {
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

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (!documents || documents.length === 0)
    return <p className="text-gray-500">No documents yet.</p>;

  return (
    <div>
      {documents.map((doc) => (
        <div>
          <div>
            <h3>{doc.title}</h3>
            <p>{doc.due_date || "Not set"}</p>
            <span>{doc.is_paid ? "Paid" : "Unpaid"}</span>
          </div>
          {/*Edit button */}
        </div>
      ))}
    </div>
  );
}
