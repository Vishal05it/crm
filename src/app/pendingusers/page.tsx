"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleSlash2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAllContexts } from "../context/AllContext";
import Loader from "../loading";
import UnauthorizedAccessPage from "../components/Unauthorized";
import ButtonLoading from "../components/ButtonLoading";
import { clearAllNotifications } from "../utils/cacheclear/personalised/clearNotifications";

type User = {
  _id: string;
  email: string;
  password: string;
  name: string;
  profilepic: string;
  companyId: string;
  isManager: boolean;
};

export default function PendingUsersPage() {
  let {
    user,
    btnLoading,
    setBtnLoading,
    pageLoading,
    setPageLoading,
    cancelLoading,
    setCancelLoading,
  } = useAllContexts();

  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  const findUsers = async () => {
    try {
      if (user.isManager) {
        setPageLoading(true);

        let response = await fetch(
          `${baseURL}/getpending/users/${user.companyId._id}`,
        );

        let usersData = await response.json();
        // console.log(usersData);

        if (usersData.success) {
          // successEmitter(usersData.message);
          setPendingUsers(usersData.pendingUsers);
        } else errorEmitter(usersData.message);
      } else {
        errorEmitter(
          "Unauthorized access, only manager can see pending user requests",
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const approveUser = async (userId: string, userSend: User) => {
    try {
      // console.log("ID function got : ", userId);

      setBtnLoading(true);

      let response = await fetch(`${baseURL}/approve/user/${userId}`, {
        method: "POST",
        body: JSON.stringify({
          ...userSend,
          managerId: user._id,
          addedMs: Date.now(),
        }),
      });

      let approveData = await response.json();
      // console.log(approveData);

      if (approveData.success) {
        successEmitter(approveData.message);
        setPendingUsers(pendingUsers.filter((user) => user._id != userId));
        setBtnLoading(false);
        await clearAllNotifications(userId);
      } else errorEmitter(approveData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const denyUser = async (userId: string) => {
    try {
      setCancelLoading(true);

      let response = await fetch(`${baseURL}/approve/user/${userId}`, {
        method: "DELETE",
      });

      let denyData = await response.json();
      // console.log(approveData);

      if (denyData.success) {
        //  successEmitter(approveData.message);
        setPendingUsers(pendingUsers.filter((user) => user._id != userId));
      } else errorEmitter(denyData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    let fetchUsers = async () => {
      await findUsers();
    };
    fetchUsers();
  }, []);

  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <>
          {user.isManager ? (
            <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
              <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
                  <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Pending User Queue
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                          Pending Users
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                          Review incoming team join requests before granting
                          access to the workspace.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-90">
                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                            <UsersRound className="h-5 w-5" />
                          </div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Total
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                            {pendingUsers.length}
                          </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Approvals
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                            Ready
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 px-6 py-4">
                    <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500">
                      All Users
                    </button>

                    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                      Pending for approval
                    </div>
                  </div>
                </div>

                {/* Empty State */}
                {pendingUsers.length === 0 ? (
                  <div className="overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
                    <div className="px-8 py-14 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        <CircleSlash2 className="h-7 w-7" />
                      </div>

                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        No pending users
                      </h2>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        New account requests will appear here when users apply
                        to join your company.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div
                        key={user._id}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
                      >
                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                          {/* Left: User Info */}
                          <div className="flex items-center gap-4">
                            <img
                              src={user.profilepic}
                              alt="profile"
                              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-slate-200 dark:border-slate-900 dark:ring-slate-700"
                            />

                            <div>
                              <p className="text-base font-semibold text-slate-900 dark:text-white">
                                {user.name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {user.email}
                              </p>

                              <div className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Requested access
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-3 sm:justify-end">
                            <button
                              disabled={btnLoading || cancelLoading}
                              onClick={async () => {
                                // console.log("ID sent : ", user._id);
                                await approveUser(user._id, user);
                              }}
                              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {btnLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  Approving <ButtonLoading />
                                </div>
                              ) : (
                                "Approve"
                              )}
                            </button>

                            <button
                              disabled={btnLoading || cancelLoading}
                              onClick={async () => {
                                await denyUser(user._id);
                              }}
                              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-rose-600 hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-900 dark:bg-slate-950 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                            >
                              {cancelLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  Deleting <ButtonLoading />
                                </div>
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <UnauthorizedAccessPage />
          )}
        </>
      )}
    </>
  );
}
