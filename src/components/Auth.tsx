"use client";
import { useState } from "react";

import { Key, Loader2, Paperclip } from "lucide-react";

import { supabase } from "@/lib/client";
import toast from "react-hot-toast/headless";

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

    if (error) toast.error(error.message);
    else window.location.reload();

    setLoading(false);
  };

  return (
    <div className="w-ful max-w-sm space-y-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-4 bg-ink rounded-2xl shadow-sm border border-border-light">
          <Paperclip className="text-white" size={64} />
        </div>
        <h3 className="font-sans text-xl font-bold text-slate-900 uppercase tracking-tight">
          Welcome Back
        </h3>
        <p className="font-sans text-sm font-medium text-muted tracking-wider">
          Enter your email to access your vault
        </p>
      </div>
      <form onSubmit={handleAuth} className="space-y-3">
        <div className="space-y-1">
          <label className="font-mono text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full font-sans p-4 bg-surface border border-border-mid rounded-xl text-slate-900 text-md focus:ring-1 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
            placeholder="your@email.com"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full font-sans bg-ink text-white p-4 rounded-xl font-bold text-md hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Signed In"
          )}
        </button>
      </form>

      <p className="text-center font-medium text-xs text-slate-400">
        Secure, encrypted access to your documents.
      </p>
    </div>
  );
}
