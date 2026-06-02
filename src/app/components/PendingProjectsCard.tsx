import {
  CalendarDays,
  Clock3,
  FolderKanban,
  MoreHorizontal,
  TimerReset,
} from "lucide-react";
import React, { useState } from "react";
import { timeCalc } from "../utils/TimeCalculator";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";
import { useAllContexts } from "../context/AllContext";
import { getRealDate } from "../utils/DateFormat";
import { deadlineStatus } from "../utils/DeadlineStatus";
import { deadLineCalc } from "../utils/DeadlineCalc";
import ButtonLoading from "./ButtonLoading";
import { clearAllNotifications } from "../utils/cacheclear/personalised/clearNotifications";
import { clearAllProjects } from "../utils/cacheclear/personalised/clearAllProjects";

type User = {
  _id: string;
  name: string;
  profilepic: string;
};

type Company = {
  _id: string;
  companyName: string;
  companyPic: string;
};

type PendingProject = {
  _id: string;
  title: string;
  description: string;
  createdMs: number;
  isFailed: boolean;
  deadline: number;
  deadlineDate: string;
  addedMs?: number;
  isDone: boolean;
  createdBy: User;
  designation: string;
  forCompany: Company;
  required: string;
};

type Props = {
  _id: string;
  title: string;
  description: string;
  createdMs: number;
  isFailed: boolean;
  deadline: number;
  deadlineDate: string;
  addedMs?: number;
  isDone: boolean;
  createdBy: string;
  designation: string;
  forCompany: string;
  createdById: string;
  forCompanyId: string;
  required: string;
  pendingProjects: PendingProject[];
  setPendingProjects: React.Dispatch<React.SetStateAction<PendingProject[]>>;
};

function PendingProjectsCard({
  _id,
  title,
  description,
  createdMs,
  createdBy,
  isFailed,
  isDone,
  deadline,
  deadlineDate,
  designation,
  addedMs,
  forCompany,
  forCompanyId,
  createdById,
  required,
  pendingProjects,
  setPendingProjects,
}: Props) {
  const [rejecting, setRejecting] = useState<boolean>(false);
  const { user } = useAllContexts();
  const router = useRouter();
  const { btnLoading, setBtnLoading } = useAllContexts();

  const approveProject = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(`${baseURL}/approve/project/${_id}`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          createdMs: Date.now(),
          createdBy: createdById,
          isFailed,
          isDone,
          deadline,
          deadlineDate,
          designation,
          addedMs: Date.now(),
          forCompany: forCompanyId,
          managerId: user._id,
          required,
        }),
      });

      let approveData = await response.json();
      //  console.log(approveData);

      if (approveData.success) {
        successEmitter(`Project ${title} has been approved`);
        let tempArr = pendingProjects.filter((elm) => elm._id != _id);
        setPendingProjects(tempArr);
        setBtnLoading(false);
        await clearAllNotifications(createdById);
        await clearAllProjects(createdById);
        router.push("/");
      } else errorEmitter(`Something went wrong`);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const rejectProject = async () => {
    try {
      setRejecting(true);
      let response = await fetch(`${baseURL}/approve/project/${_id}`, {
        method: "DELETE",
        body: JSON.stringify({
          byUser: user._id,
          forUser: createdById,
          addedMs: Date.now(),
        }),
      });

      let rejectData = await response.json();
      //  console.log(rejectData);

      if (rejectData.success) {
        successEmitter(rejectData.message);
        router.push("/");
        let tempArr = pendingProjects.filter((elm) => elm._id != _id);
        setPendingProjects(tempArr);
        setRejecting(false);
        await clearAllNotifications(createdById);
      } else errorEmitter(rejectData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/80">
        <div className="border-b border-slate-200 bg-linear-to-r from-amber-50 via-white to-indigo-50 px-5 py-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              Pending Approval
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Project Review
            </span>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md ring-1 ring-indigo-500/20">
                <FolderKanban className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                    {title}
                  </h2>
                </div>

                <p className="mb-5 max-w-4xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {description}
                </p>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Created By
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                      {createdBy}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Designation
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                      {designation}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Company Name
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                      {forCompany}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Deadline Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                      {getRealDate(deadlineDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Days required: {required}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <Clock3 className="h-3.5 w-3.5" />
                    Deadline: {deadLineCalc(deadlineDate)} days
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <TimerReset className="h-3.5 w-3.5" />
                    Added: {addedMs ? timeCalc(addedMs) : "Not added"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-start gap-2">
              <button className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-indigo-600 dark:hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </button>

              <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                <button
                  onClick={approveProject}
                  disabled={btnLoading || rejecting}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-emerald-600"
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
                  disabled={btnLoading || rejecting}
                  onClick={rejectProject}
                  className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-rose-600"
                >
                  {rejecting ? (
                    <div className="flex items-center justify-center gap-2">
                      Rejecting <ButtonLoading />
                    </div>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Created Time
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                {timeCalc(createdMs)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Completion
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                {isDone ? "Finished" : isFailed ? "Stopped" : "In Review"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Deadline Status
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                {deadlineStatus(deadline, Number(required))} (
                {deadLineCalc(deadlineDate) - Number(required)} days window )
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingProjectsCard;
