"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import toast from "react-hot-toast/headless";

import { supabase } from "@/lib/client";

export function EmailPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // REMOVED FOR NOW FOR BETA emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      // toast.success("Check email to confirm registration!");
      toast.success("Welcome! Account created successfully.");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      toast.success("Signed in successfully.");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="font-mono text-xs font-medium text-slate-500 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full font-sans p-4 bg-surface border border-border-md rounded-xl text-slate-900 text-md focus:ring-1 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-mono text-xs font-medium text-slate-500 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full font-sans p-4 bg-surface border border-border-md rounded-xl text-slate-900 text-md focus:ring-1 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
            required
          />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleSignIn}
          className="w-full font-sans bg-ink text-white p-4 rounded-xl font-bold text-md hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={handleSignUp}
          className="w-full font-sans border border-border-mid text-slate-700 p-3 rounded-xl font-semibold text-xs hover:bg-slate-50 transition-colors block text-center"
        >
          Create an account instead
        </button>
      </div>
    </form>
  );
}
