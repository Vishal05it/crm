"use client";

import Link from "next/link";
import { useAllContexts } from "../context/AllContext";
import { getRealDate } from "../utils/DateFormat";
import { useState } from "react";
import DeleteAccountModal from "../components/DeleteAccountModal";
import {
  UserRound,
  Mail,
  CalendarDays,
  ShieldCheck,
  Settings,
  Trash2,
} from "lucide-react";

export default function ProfilePage() {
  let { user } = useAllContexts();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-black dark:via-slate-950 dark:to-black">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
          {/* Header */}
          <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 shadow-sm dark:text-indigo-400">
                  <UserRound className="h-8 w-8" />
                </div>

                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Profile
                  </div>

                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    Profile
                  </h1>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    View and manage your account information.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/editprofile"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Link>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-rose-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-rose-600 hover:text-white hover:shadow-md dark:border-rose-900 dark:bg-slate-950 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={user?.profilepic}
                    alt="Profile"
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl ring-1 ring-slate-200 dark:border-slate-900 dark:ring-slate-700"
                  />

                  <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md">
                    <UserRound className="h-5 w-5" />
                  </div>
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Account Active
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Account Created
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  {getRealDate(user.createdAt)}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Mail className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Email Address
                </p>
                <p className="mt-2 break-all text-sm font-medium text-slate-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                Keep your profile details up to date so your workspace stays
                accurate across projects and approvals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </>
  );
}
