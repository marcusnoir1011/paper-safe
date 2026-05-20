"use client";

import { useState } from "react";

import toast from "react-hot-toast/headless";

import { supabase } from "@/lib/client";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-3 py-4">
        <h3 className="font-sans text-lg font-bold text-slate-900">
          Check Your Email
        </h3>
        <p className="font-sans text-sm tex-muted leading-relaxed">
          We sent a secure, passwordless sign-in link to{" "}
          <strong className="text-slate-900">{email}</strong>.
        </p>
        <button
          onClick={() => setIsSent(false)}
          className="font-mono text-xs font-bold text-ink underline underline-offset-4 uppercase tracking-wider"
        >
          Back to Login
        </button>
      </div>
    );
  }
  return (
    <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
      <div className="space-y-1">
        <label
          htmlFor="magic-email"
          className="font-mono text-xs font-medium text-slate-500 uppercase tracking-wider"
        >
          Email Address
        </label>
        <input
          id="magic-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full font-sans p-4 bg-surface border border-border-mid rounded-xl text-slate-900 text-md focus:ring-1 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
          placeholder="name@university.edu"
          disabled={loading}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full font-sans bg-ink text-white p-4 rounded-xl font-bold text-md hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {loading ? "Sending Link..." : "Sending Magic LInk"}
      </button>
    </form>
  );
}
