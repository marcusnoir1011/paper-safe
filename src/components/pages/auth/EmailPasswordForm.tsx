"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { supabase } from "@/lib/client";

export function EmailPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const buttonText = isSignUp ? "Sign Up" : "Sign In";

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
      router.refresh();
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);

    console.log("1, Inside hanldeSignIn - about to call Supabase...");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      toast.success("Signed in successfully.");
      window.location.href = "/";

      // router.refresh();
      // router.push("/");
    } catch (err: any) {
      toast.error(err.message);
      alert(err.message);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignUp) {
      handleSignIn();
      console.log("Logging existing user in...");
    } else {
      handleSignUp(e);
      console.log("Registering new user...");
    }
  };

  return (
    <form onSubmit={handleForm} className="space-y-4">
      <div className="space-y-3">
        <h2 className="font-sans text-3xl font-bold text-center text-ink tracking-tight">
          {isSignUp ? "Create your Paper Safe" : "Sign In to Paper Safe"}
        </h2>
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
          type="submit"
          disabled={loading}
          className="w-full font-sans bg-ink text-white p-4 rounded-xl font-bold text-md hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            buttonText
          )}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full font-sans border border-border-mid text-slate-700 p-3 rounded-xl font-semibold text-xs hover:bg-slate-50 transition-colors block text-center"
        >
          {isSignUp ? "Login In Here" : "Create an Account Instead"}
        </button>
      </div>
    </form>
  );
}
