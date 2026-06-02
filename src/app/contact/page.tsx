"use client";

type Message = {
  email: string;
  subject: string;
  text: string;
  name: string;
};

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquareText } from "lucide-react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoading from "../components/ButtonLoading";

export default function ContactPage() {
  const [message, setMessage] = useState<Message>({
    email: "",
    subject: "",
    text: "",
    name: "",
  });

  const [sendBtn, setSendBtn] = useState<boolean>(false);

  let onChangeFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const sendMessage = async () => {
    if (!message.email || !message.name || !message.text) {
      errorEmitter("Email, Name & Message all are required");
      return;
    }

    if (message.name.length < 3) {
      errorEmitter("Name must be atleast 3 characters long");
      return;
    }

    if (message.text.length < 10) {
      errorEmitter("Message too short, must be atleast 10 characters long");
      return;
    }

    try {
      setSendBtn(true);

      let response = await fetch(`${baseURL}/contact/${message.email}`, {
        method: "POST",
        body: JSON.stringify(message),
      });

      let msgData = await response.json();

      // console.log(msgData);

      if (msgData.success) {
        successEmitter(msgData.message);

        setMessage({
          ...message,
          name: "",
          email: "",
          subject: "",
          text: "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSendBtn(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-8 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <MessageSquareText className="h-3.5 w-3.5" />
            Contact Ease Work
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Get in touch
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Send a message for support, feedback, partnership inquiries, or
            questions about the platform.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await sendMessage();
            }}
          >
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950/90">
              <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Send a message
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Fill out the form below and we will get back to you.
                </p>
              </div>

              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Full Name
                    </span>

                    <input
                      type="text"
                      name="name"
                      required
                      value={message.name}
                      onChange={onChangeFunc}
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </span>

                    <input
                      type="email"
                      name="email"
                      required
                      value={message.email}
                      onChange={onChangeFunc}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Subject
                    </span>

                    <input
                      type="text"
                      name="subject"
                      value={message.subject}
                      onChange={onChangeFunc}
                      placeholder="What is this about?"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Message
                    </span>

                    <textarea
                      required
                      name="text"
                      value={message.text}
                      onChange={onChangeFunc}
                      rows={7}
                      placeholder="Write your message here..."
                      className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    disabled={sendBtn}
                    type="reset"
                    onClick={() => {
                      setMessage({
                        ...message,
                        name: "",
                        email: "",
                        subject: "",
                        text: "",
                      });
                    }}
                    className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Clear
                  </button>

                  <button
                    disabled={sendBtn}
                    onClick={async () => {}}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
                  >
                    <Send className="h-4 w-4" />

                    {sendBtn ? (
                      <div className="flex items-center justify-center gap-2">
                        Sending Message <ButtonLoading />
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </div>
            </section>
          </form>
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950/90">
              <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Contact Info
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Reach out through any of the following channels.
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                      <Mail className="h-5 w-5" />
                    </div>

                    <div>
                      <a
                        href="mailto:www.vishal.tiwari007@gmail.com"
                        className="text-sm font-medium text-slate-900 dark:text-white"
                      >
                        Email
                      </a>

                      <br />

                      <a
                        href="mailto:www.vishal.tiwari007@gmail.com"
                        className="mt-1 text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                      >
                        www.vishal.tiwari007@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                      <Phone className="h-5 w-5" />
                    </div>

                    <div>
                      <a
                        href="tel:+91 9696777533"
                        className="text-sm font-medium text-slate-900 dark:text-white"
                      >
                        Phone
                      </a>

                      <br />

                      <a
                        href="tel:+91 9696777533"
                        className="mt-1 text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                      >
                        +91 9696777533
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Office
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Lucknow, Uttar Pradesh, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950/90">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Response Time
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  We usually respond within 24 to 48 hours on working days.
                </p>

                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                  For urgent account or project issues, mention your company ID
                  in the message.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
