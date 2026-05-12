import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { Calendar, FileText } from "lucide-react";

import { ImagePreview } from "./ImagePreveiw";
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
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
        <p className="text-slate-400 text-sm">
          No documents found in your vault.
        </p>
      </div>
    );

  const docsWithUrls = await Promise.all(
    documents.map(async (doc) => {
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.image_path, 3600);

      return { ...doc, signedUrl: data?.signedUrl };
    }),
  );

  return (
    <div className="space-y-6">
      {docsWithUrls.map((doc) => (
        <div
          key={doc.id}
          className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-blue-300 transition-colors flex items-center gap-3"
        >
          {/*Thumbnail*/}
          <div className="relative h-28 w-28 rounded shrink-0 bg-slate-100 border-b border-slate-100 overflow-hidden">
            {doc.signedUrl ? (
              <ImagePreview src={doc.signedUrl} title={doc.title} />
            ) : (
              <div className="flex items-center justify-center h-full gap-2 text-slate-300">
                <FileText size={32} />
                <span className="text-xs font-medium">
                  No Preview available
                </span>
              </div>
            )}
          </div>

          {/*Info Area*/}
          <div className="flex-1 min-w-0 gap-3 p-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900 truncate pr-2">
                {doc.title}
              </h3>
              <p className="font-mono font-bold text-blue-600 shrink-0">
                ¥{doc.amount?.toLocaleString() || "0"}
              </p>
            </div>

            <div className="flex justify-between items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                <Calendar size={12} />
                <span>Due: {doc.due_date || "Not Set"}</span>
              </div>
              <span
                className={`
                text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                  doc.is_paid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
                `}
              >
                {doc.is_paid ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>

          {/*button*/}
          <div className="shrink-0 border-l pl-4 border-slate-100">
            <EditDoc document={doc} />
          </div>
        </div>
      ))}
    </div>
  );
}
