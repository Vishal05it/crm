"use client";

import React, { useEffect, useMemo, useOptimistic, useState } from "react";
import { ArrowDown, ArrowUp, Send, ImagePlus, Smile } from "lucide-react";
import { useAllContexts } from "@/app/context/AllContext";
import { useParams } from "next/navigation";
import { baseURL } from "@/app/utils/baseURL";
import { errorEmitter, successEmitter } from "@/app/utils/emitter";
import Loader from "@/app/loading";
import ButtonLoading from "@/app/components/ButtonLoading";
import MessageCard from "@/app/components/MessageCard";
import ImageMessageCard from "@/app/components/ImageMessageCard";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { clearAllMessages } from "@/app/utils/cacheclear/shared/clearAllMessages";
import { clearUnread } from "@/app/utils/cacheclear/personalised/clearUnread";

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

export default function page() {
  const {
    setshowFooter,
    pageLoading,
    setPageLoading,
    user,
    btnLoading,
    setBtnLoading,
    setUnreadMessages,
  } = useAllContexts();

  const [members, setMembers] = useState<Members[]>([]);
  const [files, setFiles] = useState<File[] | undefined[] | any[] | null[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [optimisticMessages, addOptimisticMessages] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage],
  );
  const [title, setTitle] = useState<string>("");
  const [showMembers, setShowMembers] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [sendBtn, setSendBtn] = useState<boolean>(false);
  const [sendMessageState, setSendMessageState] = useState<string>("");
  const param = useParams();

  const getAllMembers = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(
        `${baseURL}/members/${param.projectId}/allmembers`,
        { next: { revalidate: 30 } },
      );
      let memberData = await response.json();
      // console.log(memberData);
      if (memberData.success) {
        //  successEmitter(memberData.message);
        setMembers(memberData.members);
        setTitle(memberData.project.title);
        setMessages(memberData.messages);
      } else errorEmitter(memberData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (files.length == 0 && sendMessageState.length <= 0) {
        errorEmitter("Cannot send empty message");
        return;
      }

      setSendBtn(true);
      if (files) {
        if (files.length > 0) {
          await Promise.all(
            files.map(async (file) => {
              let formData = new FormData();
              formData.append("image", file);
              formData.append("message", "No message found");
              formData.append("userId", user._id);
              formData.append("forCompany", user.companyId._id);
              let uploadRes = await fetch(
                `${baseURL}/uploadmultiple/messages/${param.projectId}`,
                {
                  method: "POST",
                  body: formData,
                },
              );
              let imgData = await uploadRes.json();

              if (imgData.success) {
                // successEmitter(imgData.message);
                addOptimisticMessages(imgData.newMessage);
                setMessages([...messages, imgData.newMessage]);
                await clearAllMessages(param.projectId as string);
                await Promise.all(
                  members.map(async (member) => {
                    await clearUnread(
                      param.projectId as string,
                      member.user._id,
                    );
                  }),
                );
              } else errorEmitter(imgData.message);
              return;
            }),
          );
          setBtnLoading(false);
          setFiles([]);
          return;
        }
      }
      let response = await fetch(`${baseURL}/messages/${user._id}`, {
        method: "POST",
        body: JSON.stringify({
          forProject: param.projectId,
          message: sendMessageState,
          forCompany: user.companyId._id,
        }),
      });

      let msgData = await response.json();
      if (msgData.success) {
        // successEmitter(msgData.message);
        addOptimisticMessages(msgData.newMessage);
        setMessages([...messages, msgData.newMessage]);
        setSendMessageState("");
        await clearAllMessages(param.projectId as string);
        await Promise.all(
          members.map(async (member) => {
            await clearUnread(param.projectId as string, member.user._id);
          }),
        );
      } else errorEmitter(msgData.message);
      setSendBtn(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendBtn(false);
    }
  };

  const readAllMessages = async () => {
    try {
      let response = await fetch(
        `${baseURL}/messages/project/${param.projectId}/${user._id}`,
        {
          method: "PUT",
        },
      );
      let readData = await response.json();
      if (readData.success) {
        // successEmitter(readData.message);
        setUnreadMessages(0);
      } else errorEmitter(readData.message);
    } catch (error) {
      console.log(error);
    }
  };

  const sortedMsgs = useMemo(() => {
    return messages.sort((a, b) => a.addedMs - b.addedMs);
  }, [messages]);

  useEffect(() => {
    setshowFooter(false);
    let fetchMembers = async () => {
      await getAllMembers();
      await readAllMessages();
    };
    fetchMembers();

    return () => setshowFooter(true);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setMessages(sortedMsgs);
    }
    let lastMessage = document.getElementById(
      `messageIdScroll${messages.length - 1}`,
    );
    lastMessage?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="flex h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-black">
          <div className="relative flex w-full flex-col overflow-hidden">
            <div className="border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                      Project Chat
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                      Live
                    </span>
                  </div>

                  <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                    {title ? title : "Chat Title Unavailable"}
                  </h1>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    Chat with your team members
                  </p>
                </div>

                <details className="relative inline-block shrink-0">
                  <summary
                    onClick={() => {
                      if (!showMembers) {
                        setShowMembers(true);
                      } else setShowMembers(false);
                    }}
                    className="list-none cursor-pointer rounded-full border border-emerald-200 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:text-white dark:border-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                  >
                    <span>{members.length} members</span>
                    <span className="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-slate-900 dark:text-emerald-300">
                      {showMembers ? "Hide Members" : "View Members"}
                    </span>
                  </summary>

                  <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                    <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Members
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        People in this chat
                      </p>
                    </div>

                    <div className="max-h-72 overflow-auto p-3">
                      <div className="space-y-2">
                        {members.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-900"
                          >
                            <img
                              src={member.user.profilepic}
                              alt={member.user.name}
                              className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                {member.user.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {member.designation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-36">
              <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:py-8">
                {optimisticMessages.length > 0 ? (
                  optimisticMessages.map((msg, idx) => (
                    <div
                      key={msg._id}
                      className={`flex w-full ${
                        msg.sentBy._id === user._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!msg.url ? (
                        <MessageCard
                          forProject={msg.forProject}
                          isModified={msg.isModified}
                          image={msg.sentBy.profilepic}
                          message={msg.message}
                          timeStamps={msg.modifiedMs}
                          isFailed={false}
                          msgId={idx}
                          messageId={msg._id}
                          editBlock={msg.editBlock}
                          messages={messages}
                          setMessages={setMessages}
                          sentBy={msg.sentBy._id}
                        />
                      ) : (
                        <ImageMessageCard
                          forProject={msg.forProject}
                          imageUrl={msg.url}
                          image={msg.sentBy.profilepic}
                          message={msg.message}
                          timeStamps={msg.modifiedMs}
                          isFailed={false}
                          msgId={idx}
                          messageId={msg._id}
                          editBlock={msg.editBlock}
                          messages={messages}
                          setMessages={setMessages}
                          sentBy={msg.sentBy._id}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex h-full flex-col items-center justify-center py-24 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600/10 text-indigo-600 shadow-sm dark:text-indigo-400">
                      <Send className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      No messages yet
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                      Start the conversation by sending the first message.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
              <div className="relative mx-auto flex max-w-5xl items-end gap-3">
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-50 overflow-hidden rounded-3xl border border-slate-200 shadow-2xl dark:border-slate-800">
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: any) =>
                        setSendMessageState(sendMessageState + emoji.native)
                      }
                    />
                  </div>
                )}

                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 shadow-sm ring-1 ring-transparent transition-all focus-within:border-indigo-500 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-500/20">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-indigo-600 hover:text-white dark:text-slate-300 dark:hover:bg-indigo-600"
                  >
                    <Smile className="h-5 w-5" />
                  </button>

                  <label htmlFor="uploadPics" className="shrink-0">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-indigo-600 hover:text-white dark:text-slate-300 dark:hover:bg-indigo-600"
                    >
                      <label htmlFor="uploadPics">
                        <ImagePlus className="h-5 w-5" />
                      </label>
                    </button>
                  </label>

                  <input
                    type="file"
                    id="uploadPics"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles(Array.from(e.target.files));
                      }
                    }}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  <input
                    type="text"
                    value={sendMessageState}
                    onChange={(e) => setSendMessageState(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>

                <button
                  type="button"
                  disabled={btnLoading}
                  onClick={async (e) => {
                    e.preventDefault();
                    await sendMessage();
                    setShowEmojiPicker(false);
                  }}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-indigo-500"
                >
                  {sendBtn ? (
                    <div className="flex items-center gap-2">
                      Sending Message <ButtonLoading />
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  let topMessage = document.getElementById("messageIdScroll0");
                  topMessage?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800 dark:hover:bg-indigo-600 dark:hover:text-white"
                aria-label="Scroll up"
              >
                <ArrowUp className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  let lastMessage = document.getElementById(
                    `messageIdScroll${messages.length - 1}`,
                  );
                  lastMessage?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800 dark:hover:bg-indigo-600 dark:hover:text-white"
                aria-label="Scroll down"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
