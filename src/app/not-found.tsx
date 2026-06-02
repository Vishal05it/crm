"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, SearchX, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
          {/* Header */}

          <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-8 py-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600/10 text-indigo-600 shadow-sm dark:text-indigo-400">
                <SearchX className="h-10 w-10" />
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <Compass className="h-3.5 w-3.5" />
                Page Not Found
              </div>

              <h1 className="mt-5 text-7xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-8xl">
                404
              </h1>

              <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                Looks like you're lost
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                The page you are looking for doesn't exist, may have been moved,
                or the URL might be incorrect.
              </p>
            </div>
          </div>

          {/* Content */}

          <div className="p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Error Code
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  404
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Status
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  Not Found
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Suggested Action
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Return Home
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
              >
                <Home className="h-4 w-4" />
                Go to Dashboard
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                If you believe this page should exist, try refreshing the page,
                checking the URL, or returning to the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
