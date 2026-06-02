"use client";

import React, { SetStateAction, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAllContexts } from "../context/AllContext";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoading from "./ButtonLoading";
import { clearAllNotifications } from "../utils/cacheclear/personalised/clearNotifications";
import { clearProfileData } from "../utils/cacheclear/personalised/clearProfileData";
import { clearAllProjects } from "../utils/cacheclear/personalised/clearAllProjects";
import { clearUnread } from "../utils/cacheclear/personalised/clearUnread";

type Props = {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<SetStateAction<boolean>>;
};

export default function DeleteAccountModal({
  showDeleteModal,
  setShowDeleteModal,
}: Props) {
  const router = useRouter();
  const [delBtn, setDelBtn] = useState<boolean>(false);
  const {
    user,
    setUser,
    setIsLogin,
    setAllNotifications,
    setAllProjects,
    setFilterRead,
    allProjects,
    setActiveCount,
    setPendingImages,
    setCompleteCount,
    setPendingProjectsCount,
    setAllTasks,
    setAllMembers,
    setFinishedDate,
    setCalled,
    setPendingCount,
    setProject,
    setMembers,
    setImages,
  } = useAllContexts();

  const logOutFunc = async () => {
    try {
      let response = await fetch(`${baseURL}/users/logout/${user._id}`, {
        method: "POST",
        body: JSON.stringify({
          companyId: user.companyId._id,
          allProjects,
        }),
      });
      let logOutData = await response.json();
      if (logOutData.success) {
        // successEmitter(logOutData.message);
        setActiveCount(0);
        setPendingImages([]);
        setCompleteCount(0);
        setPendingProjectsCount(0);
        localStorage.removeItem("localUser");
        setUser({
          name: "",
          email: "",
          profilepic: "",
          _id: "",
          createdAt: "",
          isManager: false,
          companyId: {
            _id: "",
            companyName: "",
            companyPic: "",
          },
        });

        localStorage.removeItem("tempUserLogin");
        setIsLogin(false);
        setAllNotifications([]);
        setAllProjects([]);
        setFilterRead(0);
        setAllTasks([]);
        setAllMembers([]);
        setFinishedDate("");
        setCalled(false);
        setPendingCount(0);
        setProject({
          _id: "",
          title: "",
          addedMs: 0,
          description: "",
          deadline: 0,
          deadlineDate: "",
          createdAt: "",
          createdMs: 0,
          createdBy: "",
          updatedAt: "",
          isDone: false,
          isFailed: false,
        });
        setMembers([]);
        setImages([]);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAccount = async () => {
    try {
      setDelBtn(true);

      let response = await fetch(`${baseURL}/users/secure/${user._id}`, {
        method: "DELETE",
      });

      let deleteData = await response.json();

      if (deleteData.success) {
        successEmitter(deleteData.message);
        setDelBtn(false);
        await clearAllNotifications(user._id);
        await clearProfileData(user._id);
        await clearAllProjects(user._id);
        return true;
      } else {
        errorEmitter(deleteData.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setDelBtn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 bg-linear-to-r from-red-50 via-white to-red-50 px-6 py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600/10 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Delete Account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
            <p className="text-sm leading-6 text-red-700 dark:text-red-300">
              Your profile, account data, and related access will be removed
              permanently.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              disabled={delBtn}
              onClick={() => setShowDeleteModal(false)}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              No
            </button>

            <button
              disabled={delBtn}
              onClick={async () => {
                let result = await deleteAccount();
                if (result) {
                  setShowDeleteModal(false);
                  await logOutFunc();
                }
              }}
              className="rounded-full bg-red-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
            >
              {delBtn ? (
                <div className="flex items-center justify-center gap-2">
                  Deleting Account <ButtonLoading />
                </div>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
