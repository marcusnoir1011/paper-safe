"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  Scan,
  Calendar,
  JapaneseYen,
} from "lucide-react";

import toast from "react-hot-toast/headless";

import { supabase } from "@/lib/client";
import { recognizeImage } from "@/lib/tesseract";
import { parseJpBill } from "@/utility/parseJpBill";

import CameraOcr from "./CameraOcr";

export default function UploadDoc() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const proccessDocumentFile = async (file: File | Blob, fileName: string) => {
    try {
      setLoading(true);
      const tempUrl = URL.createObjectURL(file);
      const rawText = await recognizeImage(tempUrl);
      console.log("OCR output text:\n", rawText);

      const { extractedAmount, extractedDate } = parseJpBill(rawText);

      setAmount(extractedAmount || "");
      setDueDate(extractedDate || "");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User Not Logged in");

      const filePath = `${user.id}/${Date.now()}-${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("documents").insert({
        user_id: user.id,
        title: fileName,
        image_path: filePath,
        category: "Unsorted",
        amount: extractedAmount ? parseInt(extractedAmount) : 0,
        due_date: extractedDate || null,
        is_paid: false,
      });
      if (dbError) throw dbError;

      toast.success("Uploaded Successfully!");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An issue occurred during extraction");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await proccessDocumentFile(file, file.name);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Left */}
        <div className="relative group h-full flex">
          <input
            type="file"
            onChange={handleUploadClick}
            disabled={loading}
            className="hidden"
            id="file-upload"
            accept="image/*"
          />
          <label
            htmlFor="file-upload"
            className={`
              flex flex-col items-center justify-center w-full py-12 px-4
              border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200
              ${
                loading
                  ? "bg-slate-50 border-border-mid cursor-wait"
                  : "bg-surface border-border-mid hover:border-ink hover:bg-slate-50/50"
              }
              `}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-5">
                <Loader2 className="text-ink animate-spin" size={32} />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900 font-sans tracking-tight">
                    Analyzing Document
                  </p>
                  <p className="font-mono text-[10px] text-muted mt-1 uppercase tracking-widest">
                    Running Tesseract ORC...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5">
                <div className="p-4 bg-slate-100 text-ink rounded-full group-hover:scale-110 transition-transform duration-200">
                  <UploadCloud size={32} />
                </div>
                <div className="text-center">
                  <p className="font-sans text-md md:text-sm font-semibold text-slate-900">
                    Drop Your Bill Here or{" "}
                    <span className="text-ink underline underline-offset-4">
                      browse
                    </span>
                  </p>
                  <p className="font-mono text-[10px] text-muted mt-1 uppercase tracking-wider">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Right */}
        <div className="border-2 border-dashed hover:border-ink border-border-mid rounded-3xl overflow-hidden bg-surface p-4 flex flex-col justify-center shadow-sm">
          <CameraOcr
            processingFromParent={loading}
            onCapture={async (blob, name) => {
              await proccessDocumentFile(blob, name);
            }}
          />
        </div>
      </div>

      {/*Preview*/}
      {amount && !loading && (
        <div className="bg-surface border border-border-light rounded-2xl overflow-hidden shadow-sm animate-pulse [animation-iteration-count:1]">
          <div className="bg-slate-50/80 px-4 py-2 border-b border-border-light flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scan size={14} className="text-ink" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Data Extraction Result
              </span>
            </div>
            <button
              onClick={() => {
                setAmount("");
                setDueDate("");
              }}
              className="font-mono text-md md:text-sm font-bold text-muted hover:text-ink uppercase transition-colors"
            >
              Dismiss
            </button>
          </div>

          <div className="p-6 grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted font-mono uppercase tracking-wider text-[10px] font-bold">
                <JapaneseYen size={12} />
                <span>Amount Detected</span>
              </div>
              <p className="text-2xl font-sans font-bold text-slate-900 tracking-tighter">
                ¥{Number(amount).toLocaleString()}
              </p>
            </div>
            <div className="space-y-3 border-l border-border-light pl-6">
              <div className="flex items-center gap-3 text-muted font-mono uppercase tracking-tighter">
                <Calendar size={12} />
                <span>Due Date</span>
              </div>
              <p>{dueDate || "Not Set"}</p>
            </div>
          </div>
          <div className="bg-green-50/30 px-6 py-4 flex items-center border-t border-border-light gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle2 size={12} className="text-green-600" />
            </div>
            <span className="font-sans text-sm font-bold text-green-600 uppercase tracking-tighter">
              Auto-saved to your PAPER SAFE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
