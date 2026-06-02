"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { timeCalc } from "../utils/TimeCalculator";
import { CircleX, PencilLine, Smile, Trash2, X } from "lucide-react";
import { useAllContexts } from "../context/AllContext";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoading from "./ButtonLoading";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { clearAllMessages } from "../utils/cacheclear/shared/clearAllMessages";

type Props = {
  isModified: boolean;
  image: string;
  message: string;
  timeStamps: number;
  isFailed: boolean;
  sentBy: string;
  msgId: number;
  editBlock: number;
  messages: Message[];
  setMessages: React.Dispatch<SetStateAction<Message[]>>;
  messageId: string;
  forProject: string;
};

type Members = {
  _id: string;
  user: User;
  name: string;
  forProject: string;
  isAdmin: boolean;
  designation: string;
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

export default function MessageCard({
  image,
  message,
  timeStamps,
  isFailed,
  msgId,
  sentBy,
  editBlock,
  messages,
  setMessages,
  messageId,
  isModified,
  forProject,
}: Props) {
  const { user, btnLoading, setBtnLoading, cancelLoading, setCancelLoading } =
    useAllContexts();

  const isOwnMessage = user._id === sentBy;

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [tempMessage, setTempMessage] = useState<string>(message);
  const [vanishMsg, setVanishMsg] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(isFailed);
  const [modified, setModified] = useState<boolean>(isModified);

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

  const editMessage = async (): Promise<boolean> => {
    if (tempMessage.length == 0) {
      errorEmitter("Cannot send empty message");
      setTempMessage(message);
      return false;
    }

    try {
      setBtnLoading(true);

      let response = await fetch(
        `${baseURL}/messages/modifymessage/${messageId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            sentBy: user._id,
            message: tempMessage,
          }),
        },
      );

      let editData = await response.json();

      // console.log(editData);

      if (editData.success) {
        // successEmitter(editData.message);
        setModified(true);
        setBtnLoading(false);
        await clearAllMessages(forProject);
        return true;
      } else {
        errorEmitter(editData.message);
        isFailed = true;
        setFailed(true);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          animation: vanishMsg ? `vanishMsg 0.65s linear forwards` : "",
        }}
        id={`messageIdScroll${msgId}`}
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

        <div className="max-w-[75%]">
          <div
            className={`rounded-3xl px-4 py-3 shadow-md ring-1 transition-all duration-200 hover:shadow-lg ${
              isOwnMessage
                ? "rounded-br-md bg-indigo-600 text-white ring-slate-200 dark:ring-slate-800"
                : "rounded-bl-md bg-white text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
            }`}
          >
            <p className="text-sm leading-6 wrap-break-words">{tempMessage}</p>

            {failed && (
              <div className="mt-3 flex items-center gap-2">
                <CircleX className="h-4 w-4 shrink-0 text-red-500" />
                <span className="text-xs font-medium text-red-500 dark:text-red-400">
                  Sending Failed
                </span>
              </div>
            )}

            {modified && (
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={
                    isOwnMessage
                      ? "rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white"
                      : "rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                >
                  Edited
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

            {editBlock > Date.now() && isOwnMessage && (
              <button
                type="button"
                onClick={async () => {
                  setOpenEditModal(true);
                }}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 text-[11px] font-medium text-emerald-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:text-white dark:border-emerald-900 dark:bg-slate-950 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
              >
                {btnLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    Editing <ButtonLoading />
                  </div>
                ) : (
                  <>
                    <PencilLine className="h-3.5 w-3.5" />
                    Edit
                  </>
                )}
              </button>
            )}

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
                {cancelLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    Deleting <ButtonLoading />
                  </div>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {openEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Edit Message
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Update your message content
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpenEditModal(false);

                    if (tempMessage.length == 0) {
                      setTempMessage(message);
                    }
                  }}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 transition-all hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative p-6">
              {showEmoji && (
                <div className="absolute left-6 top-24 z-50 overflow-hidden rounded-3xl border border-slate-200 shadow-2xl dark:border-slate-800">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) =>
                      setTempMessage(tempMessage + emoji.native)
                    }
                  />
                </div>
              )}

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Message
                </span>

                <textarea
                  value={tempMessage}
                  onChange={(e) => setTempMessage(e.target.value)}
                  rows={5}
                  className="mt-3 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                />
              </label>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmoji((prev) => !prev);
                  }}
                  className="rounded-full border border-slate-300 bg-white p-3 text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Smile className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpenEditModal(false);

                    if (tempMessage.length == 0) {
                      setTempMessage(message);
                    }
                  }}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    let result = await editMessage();

                    if (result) setOpenEditModal(false);
                  }}
                  className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                >
                  {btnLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      Updating <ButtonLoading />
                    </div>
                  ) : (
                    "Update Message"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
