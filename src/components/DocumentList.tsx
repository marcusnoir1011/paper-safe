import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import EditDoc from "./EditDoc";

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

  const docsWithUrls = await Promise.all(
    documents.map(async (doc) => {
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.image_path, 3600);

      return { ...doc, signedUrl: data?.signedUrl };
    }),
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {docsWithUrls.map((doc) => (
        <div
          key={doc.id}
          className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row gap-6 justify-between"
        >
          <div className="relative w-full md:w-48 md:h-48 bg-gray-100 rounded overflow-hidden shrink-0">
            {doc.signedUrl ? (
              <img
                src={doc.signedUrl}
                alt={doc.title}
                className="object-cover w-full h-full hover:scale-110 transition-transform cursor-zoom-in"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="grow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg leading-tight truncate max-w-[150px]">
                  {doc.title}
                </h3>
                <p className="text-xl font-mono font-bold text-blue-600">
                  ¥{doc.total_amount?.toLocaleString() || "0"}
                </p>
              </div>

              <p className="text-sm mt-1">
                Due:
                <span
                  className={
                    !doc.due ? "italic text-gray-400" : "font-semibold"
                  }
                >
                  {doc.due_date || "Not Set"}
                </span>
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span
                className={`text-xsa px-2 py-1 rounded font-medium ${
                  doc.is_paid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {doc.is_paid ? "Paid" : "Unpaid"}
              </span>

              {/*buttons */}
              <EditDoc document={doc} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
