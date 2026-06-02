"use client";

import React, { useEffect, useState } from "react";
import { Mail, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAllContexts } from "../context/AllContext";
import NotLogin from "../components/NotLogin";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { clearProfileData } from "../utils/cacheclear/personalised/clearProfileData";
import { checkLogin } from "../utils/checkLogin";

type Doc = {
  email: string;
  password: string;
};

export default function ChangeEmailPage() {
  const [emailBtn, setEmailBtn] = useState<boolean>(false);
  const router = useRouter();
  const { user, isLogin, getProfile, setIsLogin } = useAllContexts();

  const [doc, setDoc] = useState<Doc>({
    email: "",
    password: "",
  });

  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc({ ...doc, [e.target.name]: e.target.value });
  };

  const changeEmail = async () => {
    if (!doc.email || !doc.password) {
      errorEmitter("Email & Password both are required");
      return;
    }

    if (doc.password.length < 8) {
      errorEmitter("Password must be atleast 8 characters long");
      return;
    }

    try {
      setEmailBtn(true);

      let response = await fetch(`${baseURL}/users/secure/${user._id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: doc.email,
          password: doc.password,
        }),
      });

      let emailData = await response.json();

      if (emailData.success) {
        successEmitter(emailData.message);

        setDoc({
          email: "",
          password: "",
        });

        localStorage.setItem("localUser", JSON.stringify(emailData.user));
        await clearProfileData(user._id);
        router.push("/profile");
      } else errorEmitter(emailData.message);
      setEmailBtn(false);
    } catch (error) {
      console.log(error);
    } finally {
      setEmailBtn(false);
    }
  };
  const executeCheckLogin = async () => {
    try {
      let loggedData = await checkLogin(user._id);
      if (loggedData) {
        setIsLogin(true);
        return true;
      } else {
        setIsLogin(true);
        return false;
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await changeEmail();
          }}
        >
          <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center">
              <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950/90">
                <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                      <Mail className="h-7 w-7" />
                    </div>

                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      Change Email
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Verify your password and update your account email.
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-5">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Enter Password
                      </span>

                      <input
                        type="password"
                        required
                        name="password"
                        value={doc.password}
                        onChange={onChangeFunc}
                        placeholder="Enter your password"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Enter New Email
                      </span>

                      <input
                        type="email"
                        required
                        value={doc.email}
                        onChange={onChangeFunc}
                        name="email"
                        placeholder="Enter new email"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                      />
                    </label>
                  </div>

                  <div className="mt-7 flex flex-col gap-3">
                    <button
                      type="reset"
                      onClick={() => router.push("/changepassword")}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <LockKeyhole className="h-4 w-4" />
                      Change Password Instead
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="reset"
                        onClick={() => router.push("/editprofile")}
                        className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="flex-1 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                      >
                        {emailBtn ? "Updating Email..." : "Update Email"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                      Make sure you have access to the new email address before
                      updating your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <NotLogin />
      )}
    </>
  );
}
