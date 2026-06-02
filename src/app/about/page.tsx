"use client";

import React from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    title: "Simple dashboard",
    description:
      "A clean workspace to manage companies, projects, tasks, and approvals in one place.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Team collaboration",
    description:
      "Built for managers and employees to work together with role-based access.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Controlled access",
    description:
      "Pending approvals, member roles, and secure flows keep the workspace organized.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Fast and scalable",
    description:
      "Designed to grow with more features without making the UI feel crowded.",
  },
];

const stats = [
  { label: "Company-friendly", value: "1 SaaS" },
  { label: "Core stack", value: "Next.js + MongoDB" },
  { label: "Role system", value: "Manager / Employee" },
  { label: "UI style", value: "Modern + Compact" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-white to-indigo-50 shadow-sm dark:border-slate-800 dark:from-slate-950/90 dark:via-slate-950/90 dark:to-slate-900/50">
          <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <BriefcaseBusiness className="h-3.5 w-3.5" />
                About Ease Work
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                A modern project and company management SaaS built for growing
                teams.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Ease Work helps managers create companies and projects, approve
                team members, track tasks, and keep work organized in one clean
                dashboard. It is built as a practical portfolio project with a
                production-style UI and room for future scaling.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                >
                  Explore Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-transparent px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Project Focus
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Clean UI, strong workflow, and scalable structure
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Built to feel like a real SaaS app, not just a demo screen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
              What Ease Work focuses on
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              The product is designed around clarity, team control, and future
              expansion.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/80"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
              Why this project exists
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Ease Work was created to showcase a real-world SaaS structure with
              login, approval flow, dashboards, project detail pages, member
              management, notifications, and responsive dark mode UI.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Manager and employee role separation",
                "Pending approvals for users and projects",
                "Modern cards, modals, and dashboard layouts",
                "Built for portfolio strength and interview value",
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
              Built with a scalable mindset
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              The UI is intentionally compact and modular so new features can be
              added later without redesigning everything from scratch.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Frontend
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  Next.js App Router + TypeScript + Tailwind
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Backend
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  MongoDB + Mongoose + route handlers
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Auth Flow
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  Login, signup, approvals, and protected routes
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Theme
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  Light and dark mode with consistent hover states
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
