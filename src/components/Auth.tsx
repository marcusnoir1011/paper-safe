"use client";
import { useState } from "react";

import { Key, Loader2 } from "lucide-react";

import { supabase } from "@/lib/client";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: "test1234", // emailRedirectTo: `${window.location.origin}/auth/callback`
    });

    if (error) alert(error.message);
    else window.location.reload();

    setLoading(false);
  };

  return (
    <div className="w-ful max-w-sm space-y-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Key className="text-blue-600" size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Welcome Back</h3>
        <p className="text-sm text-slate-500">
          Enter your email to access your vault
        </p>
      </div>
      <form onSubmit={handleAuth} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="your@email.com"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white p-3 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Signed In"
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Secure, encrypted access to your documents.
      </p>
    </div>
  );
}
