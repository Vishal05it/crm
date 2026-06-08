"use client";

import {
  Plus,
  FolderOpen,
  ArrowRight,
  Lock,
  BarChart3,
  CheckCircle2,
  Clock3,
  UsersRound,
  Sparkles,
} from "lucide-react";
import { useAllContexts } from "./context/AllContext";
import Link from "next/link";
import ProjectCard from "./components/ProjectCard";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { baseURL } from "./utils/baseURL";
import { successEmitter } from "./utils/emitter";
import Loader from "./loading";
import { isManager } from "./utils/isManager";
import { checkLogin } from "./utils/checkLogin";

type Project = {
  title: string;
  description: string;
  _id: string;
  createdMs: number;
  deadline: number;
  deadlineDate: string;
  isFailed: boolean;
  addedMs: number;
  createdBy: string;
  isDone: boolean;
};

type Thumbnail = {
  _id: string;
  url: string;
};

type APIData = {
  thumbnail: Thumbnail;
  project: Project;
};

export default function page() {
  let {
    isLogin,
    pageLoading,
    setPageLoading,
    user,
    setUser,
    allProjects,
    setAllProjects,
    allTempProjects,
    setAllTempProjects,
    pendingCount,
    setPendingCount,
    pendingProjectsCount,
    setPendingProjectsCount,
    completeCount,
    setCompleteCount,
    activeCount,
    setActiveCount,
    setIsLogin,
  } = useAllContexts();
  const [failedCount, setFailedCount] = useState<number>(0);
  let getAllProjects = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(
        `${baseURL}/projects/findprojects/${user._id}`,
      );
      let allProjectsData = await response.json();
      // console.log(allProjectsData);
      if (allProjectsData.success) {
        // successEmitter(allProjectsData.message);
        setAllProjects(allProjectsData.allProjects);
        setAllTempProjects(allProjectsData.allProjects);
        setActiveCount(allProjectsData.activeCount);
        setCompleteCount(allProjectsData.completeCount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const router = useRouter();

  const authUser = async () => {
    let result = await isManager(user._id);
    // console.log("You are manager : ", result);
    if (result) {
      let pendingResponse = await fetch(
        `${baseURL}/getpending/users/${user?.companyId?._id}`,
      );
      let pendingData = await pendingResponse.json();
      //  console.log(pendingData);
      if (pendingData.success) setPendingCount(pendingData.numbersPending);

      let pendingProRes = await fetch(
        `${baseURL}/getpending/projects/${user?.companyId?._id}`,
      );
      let pendingProData = await pendingProRes.json();
      // console.log(pendingProData);
      if (pendingProData.success) {
        setPendingProjectsCount(pendingProData.pendingProjectsCount);
      }
    }
    setUser({ ...user, isManager: result });
  };

  const executeCheckLogin = async () => {
    try {
      if (isLogin) {
        let loggedData = await checkLogin(user._id);
        if (loggedData) {
          setIsLogin(true);
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

  const realComplete = useMemo(() => {
    let complete = 0;
    allProjects.map((project) => {
      if (project.project.isDone) {
        complete++;
      }
    });
    return complete;
  }, [allProjects]);
  const realFailed = useMemo(() => {
    let failed = 0;
    allProjects.map((project) => {
      if (project.project.isFailed) {
        failed++;
      }
    });
    return failed;
  }, [allProjects]);

  const realActive = useMemo(() => {
    let active = 0;
    allProjects.map((project) => {
      if (!project.project.isDone && !project.project.isFailed) {
        active++;
      }
    });
    return active;
  }, [allProjects]);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      await executeCheckLogin();
    };
    fetchLoginStatus();
  }, [isLogin]);

  useEffect(() => {
    let fetchProjects = async () => {
      if (allProjects.length == 0) {
        await getAllProjects();
      }
      await authUser();
    };
    fetchProjects();
    allProjects.sort((a, b) => b.project.addedMs - a.project.addedMs);
  }, []);

  useEffect(() => {
    setCompleteCount(realComplete);
    setActiveCount(realActive);
    setFailedCount(realFailed);
  }, [allProjects]);

  return (
    <>
      {!isLogin ? (
        <>
          {pageLoading ? (
            <Loader />
          ) : (
            <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
              <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
                <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-8 py-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 shadow-sm dark:text-indigo-400">
                      <Lock className="h-8 w-8" />
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Access required
                    </div>

                    <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      You’re not logged in
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Log in to access your dashboard, manage projects, and
                      track your work efficiently.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                      >
                        Log in
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href="/signup"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Your workspace dashboard will appear here once you sign
                      in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {allProjects.length > 0 ? (
            <>
              {pageLoading ? (
                <Loader />
              ) : (
                <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
                  <div className="mx-auto max-w-7xl">
                    {/* Hero */}
                    <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
                      <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                          <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                              <Sparkles className="h-3.5 w-3.5" />
                              Workspace dashboard
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                              Dashboard
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                              Manage your projects, track progress, and keep
                              your team aligned from one clean workspace.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-140">
                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                                <FolderOpen className="h-5 w-5" />
                              </div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Total
                              </p>
                              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                                {allProjects.length}
                              </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Clock3 className="h-5 w-5" />
                              </div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Active
                              </p>
                              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                                {activeCount}
                              </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Completed
                              </p>
                              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                                {completeCount}
                              </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                <BarChart3 className="h-5 w-5 text-red-600" />
                              </div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Failed
                              </p>
                              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                                {failedCount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.isManager && (
                            <button
                              onClick={() => router.push("/pendingusers")}
                              className={
                                pendingCount > 0
                                  ? `inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md`
                                  : `inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`
                              }
                            >
                              <UsersRound className="h-4 w-4" />
                              Pending Users ({pendingCount})
                            </button>
                          )}

                          {user.isManager && (
                            <button
                              onClick={() => router.push("/pendingprojects")}
                              className={
                                pendingProjectsCount > 0
                                  ? `inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md`
                                  : `inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`
                              }
                            >
                              <FolderOpen className="h-4 w-4" />
                              Pending Projects ({pendingProjectsCount})
                            </button>
                          )}
                        </div>

                        <Link
                          href="/createproject"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                        >
                          <Plus className="h-4 w-4" />
                          New Project
                        </Link>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Total Projects
                          </p>
                          <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                            {allProjects.length}
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            All projects in your workspace.
                          </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Active Projects
                          </p>
                          <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                            {activeCount}
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Currently in progress.
                          </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Completed Projects
                          </p>
                          <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                            {completeCount}
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Finished and delivered.
                          </p>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
                        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Your Projects
                              </h2>
                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Recently updated projects appear first.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {allProjects.length > 0
                              ? allProjects.map((elm, idx) => {
                                  return (
                                    <ProjectCard
                                      isDone={elm?.project.isDone}
                                      isFailed={elm?.project.isFailed}
                                      projectId={elm?.project._id}
                                      title={elm?.project.title}
                                      description={elm?.project.description}
                                      addedMs={elm?.project.addedMs}
                                      thumbnail={elm?.thumbnail.url}
                                      deadlineDate={elm?.project.deadlineDate}
                                      key={elm?.thumbnail._id}
                                    />
                                  );
                                })
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {pageLoading ? (
                <Loader />
              ) : (
                <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
                  <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
                    <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 shadow-sm dark:text-indigo-400">
                          <FolderOpen className="h-8 w-8" />
                        </div>

                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                          <Sparkles className="h-3.5 w-3.5" />
                          Empty workspace
                        </div>

                        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                          Dashboard
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                          You haven’t created any projects yet. Start by
                          creating your first project to manage tasks and
                          collaborate with your team.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Total Projects
                          </p>
                          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                            {allProjects.length}
                          </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Active
                          </p>
                          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                            {activeCount}
                          </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Completed
                          </p>
                          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                            {completeCount}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40">
                        <p className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                          Start creating projects to see them appear here.
                        </p>
                      </div>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        {user.isManager && (
                          <button
                            onClick={() => router.push("/pendingusers")}
                            className={
                              pendingCount > 0
                                ? `inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md`
                                : `inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`
                            }
                          >
                            <UsersRound className="h-4 w-4" />
                            Pending Users ({pendingCount})
                          </button>
                        )}

                        {user.isManager && (
                          <button
                            onClick={() => router.push("/pendingprojects")}
                            className={
                              pendingProjectsCount > 0
                                ? `inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md`
                                : `inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`
                            }
                          >
                            <FolderOpen className="h-4 w-4" />
                            Pending Projects ({pendingProjectsCount})
                          </button>
                        )}

                        <Link
                          href="/createproject"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                        >
                          <Plus className="h-4 w-4" />
                          New Project
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
