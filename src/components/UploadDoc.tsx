"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function UploadDoc() {
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

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
    <div className="border-2 border-dashed border-gray-300 p-10 rounded-lg text-center">
      <input
        type="file"
        onChange={handleUpload}
        disabled={loading}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Uploading Japanese Bill"}
      </label>
    </div>
  );
}
