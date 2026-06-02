"use client";

import React, { SetStateAction } from "react";
import { AlertTriangle } from "lucide-react";
import { useAllContexts } from "../context/AllContext";
import ButtonLoading from "./ButtonLoading";
import { clearAllProjects } from "../utils/cacheclear/personalised/clearAllProjects";
import { clearProjectDetails } from "../utils/cacheclear/shared/clearProjectDetails";
import { clearAllNotifications } from "../utils/cacheclear/personalised/clearNotifications";
import { clearAllTasks } from "../utils/cacheclear/shared/clearAllTasks";

type User = {
  _id: string;
  email: string;
  name: string;
  profilepic: string;
  companyId: string;
  isManager: boolean;
  createdAt: string;
};

type Members = {
  _id: string;
  user: User;
  name: string;
  forProject: string;
  isAdmin: boolean;
  designation: string;
};

type Props = {
  openLeaveModal: boolean;
  setOpenLeaveModal: React.Dispatch<SetStateAction<boolean>>;
  setMembers: React.Dispatch<SetStateAction<Members[]>>;
  members: Members[];
  removeMember: (memberId: string) => Promise<boolean>;
  selectRemoveMember: Members | undefined;
  setSelectRemoveMember: React.Dispatch<SetStateAction<Members | undefined>>;
};

export default function LeaveProjectModal({
  openLeaveModal,
  setOpenLeaveModal,
  removeMember,
  setMembers,
  members,
  setSelectRemoveMember,
  selectRemoveMember,
}: Props) {
  const { leaveBtn, setLeaveBtn, user } = useAllContexts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}

        <div className="border-b border-slate-200 bg-linear-to-r from-amber-50 via-white to-amber-50 px-6 py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Leave Project?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                The project will be deleted if you leave the project. Do you
                still want to continue?
              </p>
            </div>
          </div>
        </div>

        {/* Body */}

        <div className="p-6">
          <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-sm leading-6 text-amber-800 dark:text-amber-300">
              This action may permanently affect the project and its associated
              members. Please make sure you understand the consequences before
              continuing.
            </p>
          </div>

          {/* Footer */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => {
                setOpenLeaveModal(false);

                setSelectRemoveMember({
                  _id: "",
                  user: {
                    _id: "",
                    name: "",
                    email: "",
                    profilepic: "",
                    companyId: "",
                    isManager: false,
                    createdAt: "",
                  },
                  name: "",
                  forProject: "",
                  designation: "",
                  isAdmin: false,
                });
              }}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              No
            </button>

            <button
              disabled={leaveBtn}
              onClick={async () => {
                let result = false;

                if (selectRemoveMember) {
                  result = await removeMember(selectRemoveMember?._id);
                }

                if (result) {
                  setOpenLeaveModal(false);
                  await Promise.all(
                    members.map(async (member) => {
                      await clearAllProjects(member.user._id);
                      await clearAllNotifications(member.user._id);
                    }),
                  );
                  await clearAllTasks(members[0].forProject);
                  await clearProjectDetails(
                    members[0].forProject,
                    user.companyId._id,
                  );
                }
              }}
              className="rounded-full bg-red-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
            >
              {leaveBtn ? (
                <div className="flex items-center justify-center gap-2">
                  Leaving Project <ButtonLoading />
                </div>
              ) : (
                "Yes, Leave Project"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
