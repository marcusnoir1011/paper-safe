"use client";

import { useState } from "react";

import toast from "react-hot-toast/headless";

import { supabase } from "@/lib/client";

export async function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { data, error } = await supabase.auth.signInWithOtp({
    email: "something.email@supabase.io",
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${window.location.origin}/auth/callback`, // change later
    },
  });

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
      <div>
        <h3>Check Your Email</h3>
        <p>
          We sent a secure, passwordless sign-in link to{" "}
          <strong>{email}</strong>.
        </p>
        <button onClick={() => setIsSent(false)}>Back to Login</button>
      </div>
    );
  }
  return (
    <form onSubmit={handleMagicLinkSubmit}>
      <div>
        <label htmlFor="magic-semail">Email Address</label>
        <input
          id="magic-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@university.edu"
          disabled={loading}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Sending Link..." : "Sending Magic LInk"}
      </button>
    </form>
  );
}
