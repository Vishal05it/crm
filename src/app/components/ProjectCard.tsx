"use client";

import { Link, MoreVertical } from "lucide-react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useEffect, useState } from "react";
import { timeCalc } from "../utils/TimeCalculator";
import { useRouter } from "next/navigation";
import { useAllContexts } from "../context/AllContext";
import { deadLineCalc } from "../utils/DeadlineCalc";

type Props = {
  projectId: string;
  title: string;
  description: string;
  addedMs: number;
  isFailed: boolean;
  isDone: boolean;
  thumbnail: string;
  deadlineDate: string;
};

export default function ProjectCard({
  projectId,
  title,
  description,
  addedMs,
  isFailed,
  thumbnail,
  isDone,
  deadlineDate,
}: Props) {
  let { user } = useAllContexts();

  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/projects/${projectId}`)}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/80"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={
            thumbnail
              ? thumbnail
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9oQdakKPlxQ3endGasD0yiW2ZOpiA3tFeVw&s"
          }
          alt="Project Thumbnail"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur dark:bg-slate-950/90 dark:text-slate-200">
            Project
          </span>

          {isFailed ? (
            <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Failed
            </span>
          ) : isDone ? (
            <span className="rounded-full bg-blue-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Completed
            </span>
          ) : deadLineCalc(deadlineDate) < 10 ? (
            <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-900 shadow-sm">
              Critical
            </span>
          ) : (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Active
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-base font-semibold tracking-tight text-slate-900 dark:text-white">
            {title ? title : "Loading..."}
          </h2>

          {/* <button
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-indigo-600 dark:hover:text-white"
            aria-label="Project options"
          >
            <MoreVertical className="h-4 w-4" />
          </button> */}
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description ? description : "Loading..."}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 shadow-sm dark:bg-slate-900">
            <Link className="h-3.5 w-3.5" />
            Updated {timeCalc(addedMs)}
          </span>

          {!isDone ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 shadow-sm dark:bg-slate-900">
              {!isFailed ? (
                <span
                  className={
                    deadLineCalc(deadlineDate) < 10
                      ? `h-2 w-2 rounded-full bg-yellow-500`
                      : `h-2 w-2 rounded-full bg-green-500`
                  }
                />
              ) : (
                <span className={`h-2 w-2 rounded-full bg-red-600`} />
              )}
              {!isFailed ? (
                <> {deadLineCalc(deadlineDate)} days left</>
              ) : (
                <> Failed Project</>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 shadow-sm dark:bg-slate-900">
              <span className={`h-2 w-2 rounded-full bg-blue-500`} />
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
