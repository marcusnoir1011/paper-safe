"use client";
import { useState } from "react";
import { Paperclip } from "lucide-react";

import { MagicLinkForm } from "@/components/pages/auth/MagicLinkForm";
import { EmailPasswordForm } from "@/components/pages/auth/EmailPasswordForm";

export default function Auth() {
  const [authMethod, setAuthMethod] = useState(true); // true for magic, false for email-password
  return (
    <main className="grid place-items-center min-h-screen w-full bg-slate-50 px-6 py-12">
      <div className="w-ful mx-auto max-w-xl space-y-6">
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

        {authMethod ? <EmailPasswordForm /> : <MagicLinkForm />}

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setAuthMethod(!authMethod)}
            className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-ink transition-colors underline underline-offset-4"
          >
            {authMethod
              ? "Use Traditional Password instead"
              : "Use Passwordless Magic Link"}
          </button>
        </div>

        <p className="text-center font-medium text-xs text-slate-400">
          Secure, encrypted access to your documents.
        </p>
      </div>
    </main>
  );
}
