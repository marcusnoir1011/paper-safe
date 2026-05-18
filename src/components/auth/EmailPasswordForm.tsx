"use client";

import { useState } from "react";

import toast from "react-hot-toast/headless";

import { supabase } from "@/lib/client";

export async function EmailPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, isLoading] = useState(false);

  async function signUpNewUsers() {
    const { data, error } = await supabase.auth.signUp({
      email: "valid.email@supabase.io", // will accept user input later
      password: "example-password", // will accept user input later
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "valid.email@supabase.io", // will accept user input
      password: "example.password", // this shit the same as well
    });
  }

  async function resetPassword() {
    await supabase.auth.resetPasswordForEmail("valid.email@supabase.io", {
      redirectTo: "", // have to fill this as well
    });
  }
}
