"use client";

import { Bug, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function NotLogin() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
        {/* Header */}

        <div className="border-b border-slate-200 bg-linear-to-r from-emerald-50 via-white to-emerald-50 px-8 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 shadow-sm dark:text-red-400">
              <Bug className="h-8 w-8" />
            </div>
          </div>

          <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            You&apos;re not logged in
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
            You are not currently signed in. Log in first if you want to change
            credentials.
          </p>
        </div>

        {/* Body */}

        <div className="p-6">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
              Authentication is required before accessing account management
              features.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
            >
              <LogIn className="h-4 w-4" />
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotLogin;
