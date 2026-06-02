"use client";

import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  ImageIcon,
  LucideWorkflow,
  UsersRound,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { timeCalc } from "../utils/TimeCalculator";
import { useRouter } from "next/navigation";
import { useAllContexts } from "../context/AllContext";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";

type Notification = {
  _id: string;
  byUser: User;
  forUser: User;
  addedMs: number;
  isRead: boolean;
  on: string;
  action: string;
  forProject: Project;
  task: string | null | undefined;
  title: string | null | undefined;
};

type Company = {
  _id: string;
  companyName: string;
  companyPic: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  profilepic: string;
  createdAt: string;
  companyId: Company;
  isManager: boolean;
};

type Project = {
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
};

type Props = {
  notification: Notification;
};

function NotificationCard({ notification }: Props) {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const router = useRouter();

  const { setAllNotifications, allNotifications, user } = useAllContexts();

  const readOneNotification = async () => {
    try {
      let response = await fetch(
        `${baseURL}/notifications/readone/${notification._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            userId: user._id,
          }),
        },
      );

      let readData = await response.json();

      //  console.log(readData);

      if (readData.success) {
        //  successEmitter(readData.message);
      } else errorEmitter(readData.message);
    } catch (error) {
      console.log(error);
    }
  };

  const dismissNotification = async () => {
    try {
      let response = await fetch(
        `${baseURL}/notifications/dismiss/${notification._id}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            userId: user._id,
          }),
        },
      );

      let dismissData = await response.json();

      // console.log(dismissData);

      if (dismissData.success) {
        //  successEmitter(dismissData.message);
      } else errorEmitter(dismissData.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (notification.on.toString().toLowerCase() == "member") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("New Member Update");
        setDescription(
          `You were added to a new project with title ${notification.forProject.title} by ${notification.byUser.name}`,
        );
      } else {
        setTitle("New Member Update");
        setDescription(
          `You were removed from the project with title ${notification.forProject.title} by ${notification.byUser.name}`,
        );
      }
    } else if (notification.on.toString().toLowerCase() == "approval") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("Project Approval Update");
        setDescription(
          `Your project with title ${notification.forProject.title} has been approved by ${notification.byUser.name}`,
        );
      } else {
        setTitle("Project Approval Update");
        setDescription(
          `Your project with title ${notification.title} has been rejected by ${notification.byUser.name}`,
        );
      }
    } else if (notification.on.toString().toLowerCase() == "account") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("Account Approval Update");
        setDescription(
          `Your account has been approved by ${notification.byUser.name}`,
        );
      } else {
        setTitle("Account Approval Update");
        setDescription(
          `Your account has been deleted by ${notification.byUser.name}`,
        );
      }
    } else if (notification.on.toString().toLowerCase() == "project") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("Project Restarting Update");
        setDescription(
          `Project with title ${notification.forProject.title} has been restarted by ${notification.byUser.name}`,
        );
      } else {
        setTitle("Project Drop Update");
        setDescription(
          `Project with title ${notification.forProject.title} has been dropped by ${notification.byUser.name}`,
        );
      }
    } else if (notification.on.toString().toLowerCase() == "complete") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("Project Finish Update");
        setDescription(
          `Project with title ${notification.forProject.title} has been marked complete by ${notification.byUser.name}`,
        );
      } else {
        setTitle("Project Incomplete Update");
        setDescription(
          `Project with title ${notification.forProject.title} has been marked incomplete by ${notification.byUser.name}`,
        );
      }
    } else if (notification.on.toString().toLowerCase() == "image") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("Image Approval Update");
        setDescription(
          `Your uploaded image to ${notification.forProject.title} project has been approved by ${notification.byUser.name}`,
        );
      } else {
        setTitle("Image Rejection Update");
        setDescription(
          `Your uploaded image to ${notification.forProject.title} project has been rejected by ${notification.byUser.name}`,
        );
      }
    } else if (notification.on.toString().toLowerCase() == "imageapproval") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("New Image Uploaded");
        setDescription(
          `${notification.byUser.name} uploaded a new image to your project ${notification.forProject.title}`,
        );
      }
    } else if (notification.on.toString().toLowerCase() == "admin") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("New Project Admin");
        setDescription(
          `You are appointed as a new admin for Project ${notification.forProject.title} by ${notification.byUser.name}`,
        );
      } else {
        setTitle("No Longer Admin");
        setDescription(
          `You are removed as the admin for Project ${notification.forProject.title} by ${notification.byUser.name}`,
        );
      }
    } else if (notification.on.toString().toLowerCase() == "task") {
      if (notification.action.toString().toLowerCase() == "add") {
        setTitle("New Task Update");
        setDescription(
          `You are assigned a new task in Project ${notification.forProject.title} by ${notification.byUser.name}`,
        );
      } else if (notification.action.toString().toLowerCase() == "complete") {
        setTitle("Task Finish Update");
        setDescription(
          `Your assigned task in Project ${notification.forProject.title} to ${notification.byUser.name} has been completed`,
        );
      }
    }
  }, []);

  return (
    <>
      <div
        style={
          isDismissed
            ? { animation: "fadeNotifications 0.4s linear forwards" }
            : {}
        }
        key={notification._id}
        className={`group overflow-hidden rounded-3xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
          !notification.isRead
            ? "border-indigo-200 bg-linear-to-r from-indigo-50/70 to-white dark:border-indigo-900 dark:from-indigo-950/20 dark:to-slate-950"
            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/80"
        }`}
      >
        <div className="p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${
                  notification.action.toString().toLowerCase() === "add" ||
                  notification.action.toString().toLowerCase() === "complete"
                    ? "bg-emerald-600"
                    : "bg-red-600"
                }`}
              >
                {notification.on.toString().toLowerCase() == "account" ||
                notification.on.toString().toLowerCase() == "member" ||
                notification.on.toString().toLowerCase() == "admin" ? (
                  <UsersRound className="h-6 w-6" />
                ) : notification.on.toString().toLowerCase() == "image" ||
                  notification.on.toString().toLowerCase() ==
                    "imageapproval" ? (
                  <ImageIcon className="h-6 w-6" />
                ) : notification.on.toString().toLowerCase() == "task" ? (
                  <LucideWorkflow className="h-6 w-6" />
                ) : (
                  <FolderKanban className="h-6 w-6" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h2>

                  {!notification.isRead && (
                    <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      New
                    </span>
                  )}
                </div>

                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    {timeCalc(notification.addedMs)}
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                      notification.isRead
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {notification.isRead ? "Read" : "Unread"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {(notification.action.toString().toLowerCase() == "add" ||
                notification.action.toString().toLowerCase() == "complete") && (
                <button
                  onClick={async () => {
                    if (!notification.isRead) {
                      await readOneNotification();
                    }

                    notification.on.toString().toLowerCase() == "account"
                      ? router.push(`/profile`)
                      : router.push(`/projects/${notification.forProject._id}`);

                    setAllNotifications(
                      allNotifications.map((elm) => {
                        if (
                          elm._id == notification._id &&
                          !notification.isRead
                        ) {
                          notification.isRead = true;
                        }
                        return elm;
                      }),
                    );
                  }}
                  className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-indigo-600"
                >
                  View
                </button>
              )}

              <button
                onClick={async () => {
                  setIsDismissed(true);

                  await dismissNotification();

                  setAllNotifications(
                    allNotifications.filter(
                      (elm) => elm._id != notification._id,
                    ),
                  );
                }}
                className="rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-600 hover:text-white hover:shadow-md dark:border-red-900 dark:bg-slate-950 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationCard;
