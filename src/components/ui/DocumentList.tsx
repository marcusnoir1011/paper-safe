import { Calendar, ChevronRight, FileText } from "lucide-react";

import { ImagePreview } from "./ImagePreveiw";
import EditDoc from "./EditDoc";

export default function DocumentList({ documents }: { documents: any[] }) {
  if (!documents || documents.length === 0)
    return (
      <div className="text-center py-20 border-2 border-dashed border-border-mid rounded-3xl bg-surface/50">
        <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText size={26} className="text-muted" />
        </div>
        <p className="text-label font-sans font-medium">
          Your PAPER SAFE is currently empty.
        </p>
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest mt-2">
          Upload a bill to get started
        </p>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-2">
        <span className="font-mono text-sm font-bold uppercase tradking widest text-muted">
          Recent Docuemnts
        </span>
        <span className="font-mono text-sm font-bold text-ink bg-slate-100 px-2 py-1 rounded-lg border border-border-mid shadow-md">
          {documents.length} Items
        </span>
      </div>

      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group bg-surface border border-border-light rounded-2xl p-4 shadow-sm hover:border-border-mid hover:shadow-md transition-all flex items-center gap-3"
        >
          {/*Thumbnail*/}
          <div className="relative h-28 w-28 rounded shrink-0 bg-slate-50 border border-border-light overflow-hidden group-hover:border-border-mid transition-colors">
            {doc.signedUrl ? (
              <ImagePreview src={doc.signedUrl} title={doc.title} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-200">
                <FileText size={24} />
              </div>
            )}
          </div>

          {/*Info Area*/}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-slate-900 truncate pr-2 text-sm tracking-tight">
                {doc.title}
              </h3>
              <p className="font-bold text-sm text-ink shrink-0">
                ¥{doc.amount?.toLocaleString() || "0"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono text-[10px] font-medium text-muted uppercase tracking-tight">
                <Calendar size={16} className="text-slate-400" />
                <span>Due: {doc.due_date || "Not Set"}</span>
              </div>
              <span
                className={`
                text-xs px-2 py-1 rounded-md font-extrabold uppercase tracking-widest border ${
                  doc.is_paid
                    ? "bg-green-10 text-green-700 border-green-400"
                    : "bg-red-10 text-red-700 border-red-400"
                }
                `}
              >
                {doc.is_paid ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>

          {/*button*/}
          <div className="shrink-0 flex items-center gap-3">
            <EditDoc document={doc} />
            <ChevronRight
              size={16}
              className="text-slate-300 group-hover:text-ink transition-colors"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
