"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, FileQuestionIcon, Mail } from "lucide-react";
import { useAllContexts } from "../context/AllContext";
import Image from "next/image";
import Logo from "../../../public/logo-removebg-preview.png";

export default function Footer() {
  const { isLogin } = useAllContexts();

  return (
    <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-black/90">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}

          <div>
            <Image src={Logo} alt="Ease_work" className="ml-0 h-8 w-auto" />

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              A modern project and company management SaaS built for teams that
              want clarity, speed, and better collaboration.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com/Vishal05it"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <i className="fa-brands fa-github h-4 w-4"></i>
              </a>

              <a
                href="https://www.linkedin.com/in/vishal-tiwari-17684822a"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <i className="fa-brands fa-linkedin-in h-4 w-4"></i>
              </a>

              <a
                href="https://my-portfolio-7ffo.vercel.app/"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <i className="fa-solid fa-globe h-4 w-4"></i>
              </a>
            </div>
          </div>

          {/* Product */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              {isLogin ? (
                <li>
                  <Link
                    href="/"
                    className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Login
                  </Link>
                </li>
              )}

              {isLogin ? (
                <li>
                  <Link
                    href="/notifications"
                    className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Notifications
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/signup"
                    className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}

          <div>
            <h3 className="text-sm flex gap-4 items-center font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              <>
                Why Ease Work? <FileQuestionIcon className="text-green-500" />
              </>
            </h3>

            <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage projects, assign tasks, collaborate with team members,
              share project resources, and stay organized from one workspace.
            </p>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Designed for managers, employees, startups and growing teams.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ease Work. All rights reserved.</p>

          <p>Built for managers, employees and growing teams.</p>
        </div>
      </div>
    </footer>
  );
}
