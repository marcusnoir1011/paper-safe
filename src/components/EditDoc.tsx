"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2 } from "lucide-react";

import { supabase } from "@/lib/client";
import toast from "react-hot-toast/headless";

export default function EditDoc({ document }: { document: any }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(document.is_paid);

  useEffect(() => {
    setIsPaid(document.is_paid);
  }, [document.is_paid, isOpen]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const rawDueDate = formData.get("due_date");
    const cleanDueDate = rawDueDate && rawDueDate !== "" ? rawDueDate : null;

    const { error } = await supabase
      .from("documents")
      .update({
        due_date: cleanDueDate,
        amount: Number(formData.get("amount")),
        is_paid: isPaid,
      })
      .eq("id", document.id);

    if (error) {
      toast.error(error?.message);
    } else {
      toast.success("Successfully Edited!");
      setIsOpen(false);
      router.refresh();
    }
  };

  const handleRemove = async () => {
    const confirmed = window.confirm(
      "Remove this document from your Desk? (Your total statistics and spending insights will be kept accurate.)",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("documents")
      .update({ is_visible: false })
      .eq("id", document.id);

    if (error) {
      toast.error(error?.message || "Could not remove the document.");
    } else {
      setIsOpen(false);
      toast.success("Document removed from Desk.");
      router.refresh();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-xs font-medium text-slate-600 bg-surface border border-border-mid rounded-md hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Window */}
          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-sm border border-border-light overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border-light bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Edit Document
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              {/* Due Date Field */}
              <div className="space-y-3">
                <label className="font-mono text-[10px] font-medium text-muted uppercase tracking-widest">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    name="due_date"
                    type="date"
                    defaultValue={document.due_date}
                    className="w-full px-4 py-2 bg-white border border-border-mid rounded-lg text-sm focus:ring-1 focus:ring-ink focus:border-ink outline-none transition-all"
                  />
                </div>
              </div>

              {/* Amount Field */}
              <div className="space-y-3">
                <label className="font-mono text-[10px] font-medium text-muted uppercase tracking-widest">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">
                    ¥
                  </span>
                  <input
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    defaultValue={document.amount}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-border-mid rounded-lg text-sm focus:ring-1 focus:ring-ink focus:border-ink outline-none transition-all"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <label className="flex items-center group cursor-pointer p-4 bg-slate-50 rounded-xl border border-border-light hover:border-border-mid transition-colors">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={() => setIsPaid(!isPaid)}
                  className="peer hidden"
                />
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all
                      ${isPaid ? "bg-ink border-ink" : "bg-white border-border-mid"}`}
                >
                  {isPaid && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="ml-4 text-xs font-bold text-slate-600 uppercase tracking-tight">
                  {isPaid ? "Paid" : "Unpaid"}
                </span>
              </label>

              <div className="pt-2">
                <button
                  onClick={handleRemove}
                  className="w-full px-4 py-2 text-xs font-bold font-sans text-red-600 bg-red-300 rounded-xl shadow-sm transition-colors uppercase tracking-tight text-center"
                >
                  Remove from Desk
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-xs font-bold border border-border-mid text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-md transition-colors uppercase tracking-tight"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-xs font-bold text-white bg-ink hover:bg-slate-800 rounded-lg shadow-md transition-all active:scale-[0.98] uppercase tracking-tight"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
