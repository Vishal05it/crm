"use client";

type Props = {
  projectId: string;
};

import React, { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { useAllContexts } from "../context/AllContext";
import { useRouter } from "next/navigation";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoading from "./ButtonLoading";

export default function ChatFloatingButton({ projectId }: Props) {
  const router = useRouter();
  const [msgLoading, setMsgLoading] = useState<boolean>(false);
  const { unreadMessages, setUnreadMessages, user } = useAllContexts();
  const getUnRead = async () => {
    try {
      setMsgLoading(true);
      let response = await fetch(
        `${baseURL}/messages/project/${projectId}/${user._id}`,
      );
      let unreadData = await response.json();

      if (unreadData.success) {
        //successEmitter(unreadData.message);
        setUnreadMessages(unreadData.unread);
      } else errorEmitter(unreadData.message);
      setMsgLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      await getUnRead();
    };
    if (projectId.length > 0) {
      fetchMessage();
    }
  }, [projectId]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative flex items-end justify-end">
        <div
          className={
            unreadMessages > 0
              ? `absolute -top-10 right-0 z-100 rounded-full border border-red-500/20 bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`
              : `absolute -top-4 right-0 z-100 rounded-full border border-emerald-500/20 bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`
          }
        >
          {msgLoading ? (
            <ButtonLoading />
          ) : unreadMessages > 0 ? (
            `${unreadMessages} unread messages`
          ) : (
            "0"
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push(`/chat/${projectId}`)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl ring-1 ring-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-2xl dark:hover:bg-indigo-500"
          aria-label="Open chat"
        >
          <MessageCircleMore className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
