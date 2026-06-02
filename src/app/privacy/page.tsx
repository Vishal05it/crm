import React from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Database,
  Mail,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const sections = [
  {
    icon: <LockKeyhole className="h-5 w-5" />,
    title: "Information we collect",
    body: "We may collect your name, email address, company details, project data, and activity related to your account for authentication and workspace management.",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "How we use information",
    body: "Your data is used to operate the platform, manage projects, approve members, send notifications, and improve the overall user experience.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Data protection",
    body: "We use reasonable technical and organizational measures to help protect your information from unauthorized access, misuse, or loss.",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Contact us",
    body: "If you have questions about this policy, you can contact us through the support page or email us directly.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Privacy Policy
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Your privacy matters
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  This page explains how Ease Work handles information collected
                  through the platform. It is designed to be simple,
                  transparent, and easy to understand.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Secure access
                  </span>
                  <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Team collaboration
                  </span>
                  <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Account safety
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-90 lg:max-w-105">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Secure
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                    Access
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                    <Database className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Data
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                    Protection
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Account
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                    Safety
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/80"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                    {item.icon}
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Points */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="border-b border-slate-200 px-6 py-6 dark:border-slate-800 sm:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Key points
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              A short summary of the most important parts of this policy.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  We only collect information necessary to run the platform and
                  provide the features you use.
                </p>
              </div>

              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Project and team data remain tied to your workspace to support
                  role-based access and collaboration.
                </p>
              </div>

              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  We do not intend to sell your data. Any future changes to
                  policy should be reflected here clearly.
                </p>
              </div>

              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Users are responsible for keeping their login credentials
                  secure and reporting suspicious activity.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Last updated: May 2026
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
