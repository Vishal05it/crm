"use client";

import React, { SetStateAction, useState } from "react";
import { timeCalc } from "../utils/TimeCalculator";
import { CircleX, Trash2, Expand } from "lucide-react";
import { useAllContexts } from "../context/AllContext";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { baseURL } from "../utils/baseURL";
import { clearAllMessages } from "../utils/cacheclear/shared/clearAllMessages";

type Props = {
  image: string;
  message: string;
  messages: Message[];
  messageId: string;
  imageUrl: string;
  timeStamps: number;
  isFailed: boolean;
  sentBy: string;
  msgId: number;
  editBlock: number;
  forProject: string;
  setMessages: React.Dispatch<SetStateAction<Message[]>>;
};

type User = {
  _id: string;
  email: string;
  name: string;
  profilepic: string;
  companyId: string;
  isManager: boolean;
};

type Message = {
  _id: string;
  message: string;
  sentBy: User;
  addedMs: number;
  modifiedMs: number;
  forProject: string;
  isModified: boolean;
  editBlock: number;
  url: string;
};

export default function ImageMessageCard({
  image,
  imageUrl,
  timeStamps,
  isFailed,
  sentBy,
  msgId,
  editBlock,
  message,
  messages,
  setMessages,
  messageId,
  forProject,
}: Props) {
  const [vanishMsg, setVanishMsg] = useState<boolean>(false);

  const { user, cancelLoading, setCancelLoading } = useAllContexts();

  const isOwnMessage = user._id == sentBy;

  const deleteMessage = async (): Promise<boolean> => {
    try {
      if (!isOwnMessage) {
        errorEmitter("Cannot delete other's message");
      }

      setCancelLoading(true);

      let response = await fetch(
        `${baseURL}/messages/modifymessage/${messageId}`,
        {
          method: "DELETE",
        },
      );

      let deleteData = await response.json();

      // console.log(deleteData);

      if (deleteData.success) {
        // successEmitter(deleteData.message);
        setCancelLoading(false);
        await clearAllMessages(forProject);
        return true;
      } else {
        errorEmitter(deleteData.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div
      id={`messageIdScroll${msgId}`}
      style={{
        animation: vanishMsg ? `vanishMsg 0.65s linear forwards` : "",
      }}
      className={`group flex w-full ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwnMessage && (
        <img
          src={
            image
              ? image
              : "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
          }
          alt="sender"
          className="mr-3 h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm dark:border-slate-700"
        />
      )}

      <div className="max-w-85">
        <div
          className={`overflow-hidden rounded-3xl shadow-md ring-1 transition-all duration-200 hover:shadow-lg ${
            isOwnMessage
              ? "rounded-br-md bg-indigo-600 ring-slate-200 dark:ring-slate-800"
              : "rounded-bl-md bg-white ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
          }`}
        >
          <div className="relative overflow-hidden">
            <img
              src={imageUrl}
              alt="message"
              className="max-h-87.5 w-full object-cover transition duration-300 hover:scale-[1.02]"
            />

            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/10 to-transparent" />

            <a
              href={imageUrl}
              target="_blank"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-indigo-600"
            >
              <Expand className="h-4 w-4" />
            </a>
          </div>

          {isFailed && (
            <div className="flex items-center gap-2 border-t border-red-200/20 px-4 py-3">
              <CircleX className="h-4 w-4 shrink-0 text-red-500" />
              <span className="text-xs font-medium text-red-500">
                Sending Failed
              </span>
            </div>
          )}
        </div>

        <div
          className={`mt-2 flex items-center gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100 ${
            isOwnMessage ? "justify-end" : "justify-start"
          }`}
        >
          <p className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {timeCalc(timeStamps)}
          </p>

          {isOwnMessage && (
            <button
              type="button"
              onClick={async () => {
                setVanishMsg(true);
                let result = await deleteMessage();

                if (result) {
                  setMessages(messages.filter((msg) => msg._id != messageId));
                }
              }}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-red-200 bg-white px-3 text-[11px] font-medium text-red-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-600 hover:text-white dark:border-red-900 dark:bg-slate-950 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
