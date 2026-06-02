"use client";

import React, { useState } from "react";
import { LockKeyhole, KeyRound } from "lucide-react";
import { baseURL } from "../utils/baseURL";
import { useAllContexts } from "../context/AllContext";
import { useRouter } from "next/navigation";
import { errorEmitter, successEmitter } from "../utils/emitter";

type Doc = {
  currPass: string;
  newPass: string;
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const { btnLoading, setBtnLoading, user } = useAllContexts();

  const [doc, setDoc] = useState<Doc>({
    currPass: "",
    newPass: "",
  });

  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc({ ...doc, [e.target.name]: e.target.value });
  };

  const changePassword = async () => {
    try {
      setBtnLoading(true);

      let response = await fetch(`${baseURL}/users/secure/${user._id}`, {
        method: "POST",
        body: JSON.stringify(doc),
      });

      let passData = await response.json();

      if (passData.success) {
        successEmitter(passData.message);

        setDoc({
          currPass: "",
          newPass: "",
        });

        router.push("/profile");
      } else errorEmitter(passData.message);
      setBtnLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await changePassword();
      }}
    >
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center">
          <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950/90">
            <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                  <KeyRound className="h-7 w-7" />
                </div>

                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Change Password
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Enter your current password and choose a stronger new one.
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enter Current Password
                  </span>

                  <input
                    type="password"
                    required
                    name="currPass"
                    value={doc.currPass}
                    onChange={onChangeFunc}
                    placeholder="Enter current password"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enter New Password
                  </span>

                  <input
                    type="password"
                    required
                    name="newPass"
                    value={doc.newPass}
                    onChange={onChangeFunc}
                    placeholder="Enter new password"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                <button
                  type="reset"
                  onClick={() => router.push("/resetpassword")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <LockKeyhole className="h-4 w-4" />
                  Forgot Password?
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="reset"
                    onClick={() => router.push("/changecredentials")}
                    className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                  >
                    {btnLoading ? "Updating Password..." : "Update Password"}
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                  Use a strong password with a mix of letters, numbers, and
                  special characters for better account security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
