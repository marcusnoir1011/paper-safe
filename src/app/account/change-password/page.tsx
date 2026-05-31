"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast/headless";
import { KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";

import { supabase } from "@/lib/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password updated successfully!");
      router.refresh();
      router.push("/auth");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      toast.success("Password updated successfully!");
      router.refresh();
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-6 min-h-screen flex flex-col justify-center">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-ink transition-colros mb-6 self-start"
      >
        <ArrowLeft />
        Back to Vault
      </button>
      <div className="bg-surface p-6 rounded-2xl border border-border-light shadow-md space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-sans text-2xl font-bold text-ink tracking-tight">
            Update Security
          </h3>
          <p className="font-sans text-xs text-slate-400">
            Choose a strong new password for your PaperSafe vault.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="flex items-center gap-1 font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              <KeyRound size={12} />
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full font-sans p-3 bg-surface border border-border-md rounded-xl text-slate-900 text-md focus:ring-1 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              <ShieldCheck size={12} />
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full font-sans p-3 bg-surface border border-border-md rounded-xl text-slate-900 text-md focus:ring-1 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-sans bg-ink text-white p-4 rounded-xl font-bold text-md hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
