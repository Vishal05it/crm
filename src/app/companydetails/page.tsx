"use client";

import React, { useEffect, useState } from "react";
import { ClipboardCopy, Building2, ShieldCheck } from "lucide-react";
import { useAllContexts } from "../context/AllContext";
import UnauthorizedAccessPage from "../components/Unauthorized";
import { useRouter } from "next/navigation";
import { checkLogin } from "../utils/checkLogin";
import { isManager } from "../utils/isManager";

export default function page() {
  const { user, isLogin, setIsLogin, setUser } = useAllContexts();
  const [copy, setCopy] = useState<boolean>(false);
  const router = useRouter();
  const executeCheckLogin = async () => {
    try {
      if (isLogin) {
        let loggedData = await checkLogin(user._id);
        if (loggedData) {
          setIsLogin(true);
          let result = await isManager(user._id);
          if (result) setUser({ ...user, isManager: true });
          return true;
        } else {
          setIsLogin(false);
          router.push("/login");
          return false;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  useEffect(() => {
    const fetchLoginStatus = async () => {
      await executeCheckLogin();
    };
    fetchLoginStatus();
  }, [isLogin]);
  return (
    <>
      {isLogin ? (
        <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
          <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center">
            <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950/90">
              <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 shadow-sm dark:text-indigo-400">
                    <Building2 className="h-7 w-7" />
                  </div>

                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {user.companyId.companyName}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Share this ID with employees so they can join your company.
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Company ID
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium tracking-wider text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                      {user.companyId._id}
                    </div>

                    <button
                      onClick={() => {
                        window.navigator.clipboard.writeText(
                          user.companyId._id,
                        );
                        if (!copy) setCopy(true);
                      }}
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                    >
                      <ClipboardCopy className="mr-2 h-4 w-4" />
                      {copy ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Keep this ID private and share it only with trusted team
                      members.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => router.push("/")}
                    className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>

                  {user.isManager && (
                    <button
                      onClick={() => router.push("/editcompany")}
                      className="flex-1 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-medium text-indigo-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-md dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950"
                    >
                      Edit Company
                    </button>
                  )}

                  <button
                    onClick={() => {
                      window.navigator.clipboard.writeText(user.companyId._id);
                    }}
                    className="flex-1 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                  >
                    Share ID
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <UnauthorizedAccessPage />
      )}
    </>
  );
}
