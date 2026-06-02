"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="border-b border-slate-200 bg-linear-to-r from-red-50 via-white to-red-50 px-8 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 shadow-sm dark:text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>

          <h1 className="mt-5 text-center text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Something went wrong
          </h1>

          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
            We ran into an unexpected issue. Please try again or return to the
            home page.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
              The error can be temporary. Retry the action or navigate back to
              the dashboard.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-900/40 dark:bg-rose-900/10">
              <p className="break-all text-xs leading-5 text-rose-600 dark:text-rose-300">
                {error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
