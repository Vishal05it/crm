"use client";

import React from "react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedAccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
        {/* Header */}

        <div className="border-b border-slate-200 bg-linear-to-r from-rose-50 via-white to-rose-50 px-8 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 shadow-sm dark:text-rose-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
          </div>

          <h1 className="mt-5 text-center text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Unauthorized Access
          </h1>

          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
            You do not have permission to view this page. Please contact the
            project administrator or return to a page you are authorized to
            access.
          </p>
        </div>

        {/* Body */}

        <div className="p-6">
          <div className="rounded-2xl border border-dashed border-rose-300 bg-rose-50 px-4 py-4 dark:border-rose-500/20 dark:bg-rose-500/10">
            <p className="text-center text-xs leading-5 text-rose-700 dark:text-rose-300">
              Access to this resource is restricted based on your account role,
              permissions, or project membership.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
