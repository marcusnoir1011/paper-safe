"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { recognizeReceipt } from "@/lib/tesseract";
import { parseJpBill } from "@/utility/parseJpBill";

export default function UploadDoc() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

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
      alert("Uploaded successfully!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 p-10 rounded-lg text-center bg-white">
        <input
          type="file"
          onChange={handleUpload}
          disabled={loading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all inline-block"
        >
          {loading ? "Processing OCR..." : "Uploading Bill..."}
        </label>
      </div>
      {amount && (
        <div className="p-4 bg-blue-100 border border-blue-300 rounded-md text-sm">
          <p>
            <strong>Deteced Amount: </strong>¥{amount}
          </p>
          <p>
            <strong>Detected Date: </strong>
            {dueDate}
          </p>
        </div>
      )}
    </div>
  );
}
