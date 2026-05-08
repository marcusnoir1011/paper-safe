"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleLogic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) alert(error.message);
    else alert("Check your email for the login !");
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleLogic}
      className="flex flex-col gap-2 p-4 border rounded-lg bg-white"
    >
      <h3 className="font-bold">Login to your vault</h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        placeholder="your@email.com"
        required
      />
      <button disabled={loading} className="bg-blue-600 text-white p-2 rounded">
        {loading ? "Sending..." : "Sending Magic Link"}
      </button>
    </form>
  );
}
