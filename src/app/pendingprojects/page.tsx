"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CircleAlert,
  FolderKanban,
  Clock3,
  CheckCircle2,
  TimerReset,
} from "lucide-react";
import PendingProjectsCard from "../components/PendingProjectsCard";
import { baseURL } from "../utils/baseURL";
import { useAllContexts } from "../context/AllContext";
import { errorEmitter, successEmitter } from "../utils/emitter";
import UnauthorizedAccessPage from "../components/Unauthorized";
import { isManager } from "../utils/isManager";
import { deadlineStatus } from "../utils/DeadlineStatus";
import { deadLineCalc } from "../utils/DeadlineCalc";

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

export default function PendingProjectsPage() {
  const { user, setUser } = useAllContexts();
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);

  let getPendingProjects = async () => {
    let manager = await isManager(user._id);

    if (manager) {
      setUser({ ...user, isManager: manager });

      try {
        let response = await fetch(
          `${baseURL}/getpending/projects/${user.companyId._id}`,
        );
        let pendingData = await response.json();
        // console.log(pendingData);

        if (pendingData.success) {
          // successEmitter(pendingData.message);
          setPendingProjects(pendingData.pendingProjects);
        } else errorEmitter(pendingData.message);
      } catch (error) {
        console.log(error);
      }
    } else errorEmitter("Unauthorized access denied");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      await getPendingProjects();
    };
    fetchProjects();
  }, []);

  if (!user.isManager) {
    return <UnauthorizedAccessPage />;
  }

  const total = pendingProjects.length;
  const plenty = useMemo(() => {
    let plentyCount = pendingProjects.filter(
      (project) =>
        deadlineStatus(project.deadline, Number(project.required)) == "Plenty",
    );
    // console.log("Plenty Arr = ", plentyCount);
    return plentyCount.length;
  }, [pendingProjects]);
  const enough = useMemo(() => {
    return pendingProjects.filter(
      (project) =>
        deadlineStatus(project.deadline, Number(project.required)) ==
          "Enough" ||
        deadlineStatus(project.deadline, Number(project.required)) ==
          "Approaching",
    ).length;
  }, [pendingProjects]);
  const critical = useMemo(() => {
    return pendingProjects.filter(
      (project) =>
        deadlineStatus(project.deadline, Number(project.required)) ==
        "Critical",
    ).length;
  }, [pendingProjects]);
  // useEffect(() => {
  //   if (pendingProjects.length > 0) {
  //     console.log("Critical : ", critical);
  //     console.log("Plenty : ", plenty);
  //     console.log("Enough/ Approcahing : ", enough);
  //   }
  // }, [pendingProjects.length]);
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  <FolderKanban className="h-3.5 w-3.5" />
                  Pending Project Queue
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Pending Projects
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Review incoming project requests before approval. Keep the
                  queue moving and make sure each project meets your team
                  standards.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-140">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Total
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {total}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Plenty Time
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {plenty}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Enough Time
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {enough}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <TimerReset className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Critical
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {critical}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-6 py-4">
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 dark:hover:bg-indigo-500">
              All Projects
            </button>

            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Ready for review
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-5">
          {pendingProjects.length > 0 ? (
            pendingProjects.map((project, idx) => (
              <PendingProjectsCard
                key={idx}
                _id={project._id}
                title={project.title}
                description={project.description}
                createdMs={project.createdMs}
                createdBy={project.createdBy.name}
                isFailed={project.isFailed}
                isDone={project.isDone}
                deadline={project.deadline}
                deadlineDate={project.deadlineDate}
                designation={project.designation}
                addedMs={project.addedMs}
                forCompany={project.forCompany.companyName}
                createdById={project.createdBy._id}
                forCompanyId={project.forCompany._id}
                required={project.required}
                pendingProjects={pendingProjects}
                setPendingProjects={setPendingProjects}
              />
            ))
          ) : (
            <div className="overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
              <div className="px-8 py-14 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <CircleAlert className="h-7 w-7" />
                </div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  No pending projects
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  You are all caught up for now. New project requests will
                  appear here when they arrive.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
