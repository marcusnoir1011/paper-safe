"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function EditDoc({ doc }: { doc: any }) {
  const router = useRouter();
  const [isPaid, setIsPaid] = useState(doc.is_paid);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await supabase
      .from("documents")
      .update({
        due_date: formData.get("due_date"),
        amount: formData.get("amount"),
        is_paid: formData.get("is_paid"),
      })
      .eq("id", doc.id);

    router.refresh(); // Updates the server list auto
    alert("Updated!");

    return (
      <form onSubmit={handleUpdate} className="mt-4 p-2 border-t space-y-2">
        <input
          name="due_date"
          type="date"
          defaultValue={doc.due_date}
          className="border p-1 w-full text-xs"
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount (¥)"
          defaultValue={doc.amount}
          className="border p-1 w-full text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPaid}
            onChange={() => setIsPaid(!isPaid)}
          />
          Mark as Paid
        </label>
        <button
          type="submit"
          className="bg-black text-white text-xs px-3 py-1 rounded"
        >
          Save Changes
        </button>
      </form>
    );
  };
}
