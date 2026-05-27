"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast/headless";

import { supabase } from "@/lib/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

  return (
    <form className="space-y-3">
      <div className="space-y-1">
        <h3>Set New Password</h3>
        <label className="font-mono text-xs font-medium text-slate-500 uppercase tracking-wider">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full font-sans p-4 bg-surface border border-border-md rounded-xl text-slate-900 text-md focus:ring-1 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
          required
          disabled={loading}
        />
      </div>

      <button
        onClick={handlePasswordUpdate}
        type="submit"
        disabled={loading}
        className="w-full font-sans bg-ink text-white p-4 rounded-xl font-bold text-md hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
