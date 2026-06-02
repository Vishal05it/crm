import Link from "next/link";
import { FolderX, ArrowLeft } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 via-white to-slate-50 px-8 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400">
              <FolderX className="h-8 w-8" />
            </div>
          </div>

          <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Project not found
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
            The project you are looking for does not exist or may have been
            removed.
          </p>
        </div>

        <div className="p-6">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
              You can return to the dashboard or create a new project to get
              started again.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-md dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-600 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <Link
              href="/projects/createproject"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Create Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
