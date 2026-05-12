"use client";

import { useState } from "react";

import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  Scan,
  Calendar,
  JapaneseYen,
} from "lucide-react";

import { supabase } from "@/lib/client";
import { recognizeReceipt } from "@/lib/tesseract";
import { parseJpBill } from "@/utility/parseJpBill";

export default function UploadDoc() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // ocr
      const tempUrl = URL.createObjectURL(file);
      const rawText = await recognizeReceipt(tempUrl);
      const { extractedAmount, extractedDate } = parseJpBill(rawText);

      setAmount(extractedAmount);
      setDueDate(extractedDate);

      // getting current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // upload doc to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // save to database
      const { error: dbError } = await supabase.from("documents").insert({
        user_id: user.id,
        title: file.name,
        image_path: filePath,
        category: "Unsorted",
        amount: extractedAmount ? parseInt(extractedAmount) : 0,
        due_date: extractedDate || null,
        is_paid: false,
      });
      if (dbError) throw dbError;
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <input
          type="file"
          onChange={handleUpload}
          disabled={loading}
          className="hidden"
          id="file-upload"
          accept="image/*"
        />
        <label
          htmlFor="file-upload"
          className={`
            flex flex-col items-center justify-center w-full p-10
            border-2 border-dashed rounded-2xl cursor-pointer
            ${
              loading
                ? "bg-slate-50 border-blue-200 cursor-not-allowed"
                : "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30"
            }
            `}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-blue-600 animate-spin" size={32} />
              <p className="text-sm font-medium text-slate-600">
                Reading receipt with OCR...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                <UploadCloud size={28} />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-700">
                  Click to upload
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          )}
        </label>
      </div>

      {/*Preview*/}
      {amount && !loading && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-pulse [animation-iteration-count:1]">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
            <Scan size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Detected Info
            </span>
          </div>

          <div className="p-4 grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap–1.5 text-slate-500">
                <JapaneseYen size={14} />
                <span className="text-xs font-medium">Total Amount</span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                ¥{Number(amount).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar size={14} />
                <span className="text-xs font-medium">Due Date</span>
              </div>
              <p>{dueDate || "Not Set"}</p>
            </div>
          </div>
          <div>
            <CheckCircle2 size={14} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">
              Ready to save
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
