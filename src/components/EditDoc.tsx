"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, DollarSign, CheckCircle2 } from "lucide-react";

import { supabase } from "@/lib/client";

export default function EditDoc({ document }: { document: any }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(document.is_paid);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const { error } = await supabase
      .from("documents")
      .update({
        due_date: formData.get("due_date"),
        amount: Number(formData.get("amount")),
        is_paid: isPaid,
      })
      .eq("id", document.id);

    if (error) {
      alert("Error updating: " + error.message);
    } else {
      router.refresh();
      alert("Updated successfull!");
    }
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
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
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                Edit Document
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              {/* Due Date Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    name="due_date"
                    type="date"
                    defaultValue={document.due_date}
                    className="w-full pl-3 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Amount Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    ¥
                  </span>
                  <input
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    defaultValue={document.amount}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <label className="flex items-center group cursor-pointer p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={() => setIsPaid(!isPaid)}
                  className="peer hidden"
                />
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                      ${isPaid ? "bg-green-500 border-green-500" : "bg-white border-slate-300"}`}
                >
                  {isPaid && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-900">
                  Mark as Paid
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
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
