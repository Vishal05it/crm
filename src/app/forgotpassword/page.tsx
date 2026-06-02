"use client";

type Doc = {
  email: string;
  otp: number;
  password: string;
};

import React, { useState } from "react";
import {
  ArrowLeft,
  MailWarning,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { baseURL } from "../utils/baseURL";
import { useAllContexts } from "../context/AllContext";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoading from "../components/ButtonLoading";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [doc, setDoc] = useState<Doc>({
    email: "",
    otp: 0,
    password: "",
  });

  let onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc({ ...doc, [e.target.name]: e.target.value });
  };

  const [otpBtn, setOtpBtn] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [passBtn, setPassBtn] = useState<boolean>(false);
  const { isLogin } = useAllContexts();

  const sendOTP = async () => {
    if (isLogin) {
      errorEmitter("Please log out first to send OTP");
      return;
    }

    try {
      setOtpBtn(true);

      const response = await fetch(
        `${baseURL}/mailer/forgotpassword/${doc.email}`,
        {
          method: "POST",
          body: JSON.stringify({
            sendingAt: Date.now(),
          }),
        },
      );

      const otpData = await response.json();
      //console.log(otpData);

      if (otpData.success) {
        setShowError(false);
        successEmitter(otpData.message);
      } else {
        errorEmitter(otpData.message);
        setShowError(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOtpBtn(false);
    }
  };

  const changePassword = async () => {
    if (!doc.otp || !doc.password || !doc.email) {
      errorEmitter("Email, OTP and Password all are required");
      return;
    }

    if (doc.password.length < 8) {
      errorEmitter("Password must be atleast 8 characters long");
      return;
    }

    try {
      setPassBtn(true);

      let response = await fetch(
        `${baseURL}//mailer/forgotpassword/${doc.email}`,
        {
          method: "PUT",
          body: JSON.stringify({
            sendingAt: Date.now(),
            password: doc.password,
            otpUser: doc.otp,
          }),
        },
      );

      let passData = await response.json();
      //  console.log(passData);

      if (passData.success) {
        successEmitter(passData.message);
        router.push("/login");
        setShowError(false);
      } else errorEmitter(passData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setPassBtn(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      action=""
    >
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center">
          <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
            {/* Header */}

            <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-8 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 shadow-sm dark:text-indigo-400">
                  <KeyRound className="h-7 w-7" />
                </div>
              </div>

              <h1 className="mt-5 text-center text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Forgot Password
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                Enter the OTP you received and set a new password.
              </p>
            </div>

            {/* Body */}

            <div className="p-6 md:p-8">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enter your registered email
                  </span>
                  <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-500/20">
                    <Mail className="mr-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={doc.email}
                      onChange={onChangeFunc}
                      required
                      placeholder="Enter Email"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enter OTP
                  </span>
                  <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-500/20">
                    <ShieldCheck className="mr-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="number"
                      name="otp"
                      value={doc.otp}
                      onChange={onChangeFunc}
                      required
                      placeholder="Enter OTP"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enter New Password
                  </span>
                  <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-500/20">
                    <KeyRound className="mr-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      name="password"
                      readOnly={otpBtn}
                      required
                      value={doc.password}
                      onChange={onChangeFunc}
                      placeholder="Enter new password"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    />
                  </div>
                </label>

                {showError && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
                    <div className="flex items-start gap-2">
                      <MailWarning className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>Please wait 2 minutes before requesting a new OTP</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>

                <button
                  type="reset"
                  disabled={passBtn || otpBtn}
                  onClick={async () => {
                    await sendOTP();
                  }}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-indigo-600 dark:hover:text-white"
                >
                  {otpBtn ? (
                    <div className="flex items-center justify-center gap-2">
                      Sending OTP <ButtonLoading />
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </button>

                <button
                  disabled={passBtn || otpBtn}
                  type="submit"
                  onClick={async () => {
                    await changePassword();
                  }}
                  className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-indigo-500"
                >
                  {passBtn ? (
                    <div className="flex items-center justify-center gap-2">
                      Submitting <ButtonLoading />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
