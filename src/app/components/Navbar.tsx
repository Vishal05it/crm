"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  LogOut,
  UserRound,
  Search as SearchIcon,
  SunIcon,
  MoonStar,
} from "lucide-react";
import { useAllContexts } from "../context/AllContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import Logo from "../../../public/logo-removebg-preview.png";
import Image from "next/image";
import ButtonLoading from "./ButtonLoading";
import { checkLogin } from "../utils/checkLogin";

export default function Navbar() {
  const navigate = useRouter();
  const [notifications, setNotifications] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let {
    setPageLoading,
    theme,
    darkMode,
    lightMode,
    toggleTheme,
    user,
    isLogin,
    setIsLogin,
    setUser,
    setAllNotifications,
    allProjects,
    setAllProjects,
    allTempProjects,
    filterRead,
    setFilterRead,
    filterUnRead,
    setFilterUnRead,
    project,
    setProject,
    members,
    setMembers,
    images,
    setImages,
    pendingImages,
    setPendingImages,
    allTasks,
    setAllTasks,
    allMembers,
    setAllMembers,
    finishedDate,
    setFinishedDate,
    called,
    setCalled,
    pendingCount,
    setPendingCount,
    pendingProjectsCount,
    setPendingProjectsCount,
    completeCount,
    setCompleteCount,
    activeCount,
    setActiveCount,
  } = useAllContexts();

  const [logBtn, setLogBtn] = useState<boolean>(false);

  const getNotifications = async () => {
    if (isLogin) {
      try {
        let response = await fetch(`${baseURL}/notifications/${user._id}`, {
          next: { revalidate: 30 },
        });
        let notificationsData = await response.json();
        // console.log(notificationsData, " notifiactions form navbar");
        if (notificationsData.success) {
          // successEmitter(notificationsData.message);
          setFilterUnRead(notificationsData.countUnread);
          setAllNotifications(notificationsData.allNotifications);
        } else errorEmitter(notificationsData.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const executeCheckLogin = async () => {
    try {
      let loggedData = await checkLogin(user._id);
      if (loggedData) {
        setIsLogin(true);
        return true;
      } else {
        setIsLogin(true);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    const fetchLoginStatus = async () => {
      await executeCheckLogin();
    };
    fetchLoginStatus();
  }, [isLogin]);

  const logOutFunc = async () => {
    try {
      setLogBtn(true);
      let response = await fetch(`${baseURL}/users/logout/${user._id}`, {
        method: "POST",
        body: JSON.stringify({
          companyId: user.companyId._id,
          allProjects,
        }),
      });
      let logOutData = await response.json();
      if (logOutData.success) {
        // successEmitter(logOutData.message);
        localStorage.removeItem("tempUserLogin");
        localStorage.removeItem("localUser");
        setActiveCount(0);
        setPendingImages([]);
        setCompleteCount(0);
        setPendingProjectsCount(0);
        setUser({
          name: "",
          email: "",
          profilepic: "",
          _id: "",
          createdAt: "",
          isManager: false,
          companyId: {
            _id: "",
            companyName: "",
            companyPic: "",
          },
        });
        setIsLogin(false);
        setAllNotifications([]);
        setAllProjects([]);
        setFilterRead(0);
        setAllTasks([]);
        setAllMembers([]);
        setFinishedDate("");
        setCalled(false);
        setPendingCount(0);
        setProject({
          _id: "",
          title: "",
          addedMs: 0,
          description: "",
          deadline: 0,
          deadlineDate: "",
          createdAt: "",
          createdMs: 0,
          createdBy: "",
          updatedAt: "",
          isDone: false,
          isFailed: false,
        });
        setMembers([]);
        setImages([]);
        navigate.push("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLogBtn(false);
    }
  };

  useEffect(() => {
    if (theme === "dark") darkMode();
    else lightMode();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      await getNotifications();
    };
    fetchNotifications();
  }, [isLogin]);

  let filteredArr = useMemo(() => {
    if (keyword === "") {
      setAllProjects(allTempProjects);
      return allTempProjects;
    }
    return allProjects.filter((elm: any) => {
      return (
        elm.project.title.toLowerCase().includes(keyword.toLowerCase()) ||
        elm.project.description.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }, [keyword]);

  useEffect(() => {
    setAllProjects(filteredArr);
  }, [keyword]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3 max-[580px]:grid-cols-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                onClick={() => navigate.push("/")}
                src={Logo}
                priority
                className="h-10 w-auto cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                alt="logo"
              />

              <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-800 md:block" />
            </div>

            <div className="hidden w-72 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 md:flex max-[580px]:hidden">
              <Search className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
              />
            </div>
          </div>

          <div
            onClick={() => {
              if (!isLogin) return;
              else navigate.push("/companydetails");
            }}
            className="flex justify-center max-[580px]:justify-end"
          >
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
              <img
                src={
                  user.companyId.companyPic
                    ? user?.companyId?.companyPic
                    : "https://res.cloudinary.com/dmmgofnlc/image/upload/v1780418732/Center_Logo_szzatp.png"
                }
                alt="Company Logo"
                className="h-9 w-9 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 sm:gap-4 max-[580px]:hidden">
            {isLogin && (
              <button
                type="button"
                onClick={() => navigate.push("/notifications")}
                aria-label="Notifications"
                className="relative rounded-full border border-slate-200 bg-slate-50 p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-indigo-600"
              >
                <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                <span
                  className={
                    filterUnRead > 0
                      ? "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow-sm"
                      : "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-white shadow-sm"
                  }
                >
                  <span className="flex items-center justify-center">
                    {filterUnRead}
                  </span>
                </span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="rounded-full border border-slate-200 bg-slate-50 p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-indigo-600 dark:hover:text-white"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </button>

            {isLogin ? (
              <button
                onClick={logOutFunc}
                className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md"
              >
                {logBtn ? (
                  <div className="flex items-center justify-center gap-2">
                    Logging Out <ButtonLoading />
                  </div>
                ) : (
                  "Log Out"
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate.push("/login")}
                className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
              >
                Login
              </button>
            )}

            {isLogin ? (
              <img
                src={user?.profilepic}
                onClick={() => navigate.push("/profile")}
                className="h-10 w-10 cursor-pointer rounded-full object-cover ring-2 ring-slate-200 transition-all hover:-translate-y-0.5 hover:ring-indigo-300 dark:ring-slate-700"
                alt="profile"
              />
            ) : (
              <button
                onClick={() => navigate.push("/signup")}
                className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-md dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                Sign Up
              </button>
            )}
          </div>

          {/* Burger button below 580px */}
          <div className="hidden justify-end max-[580px]:flex">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-full border border-slate-200 bg-slate-50 p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-indigo-600 dark:hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </button>
          </div>
        </div>
      </nav>
      <div
        className={`fixed inset-0 z-100 transition ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-80 border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Menu
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick access
              </p>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full border border-slate-200 bg-slate-50 p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-indigo-600 dark:hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-red-600" />
            </button>
          </div>

          <div className="px-5 py-5">
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate.push("/profile");
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <UserRound className="h-4 w-4" />
                View Profile
              </button>

              <button
                onClick={() => {
                  navigate.push("/notifications");
                  setMobileMenuOpen(false);
                }}
                className="flex w-full  items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <div className="relative flex gap-4 items-center">
                  <Bell className="h-5 w-5" />
                  <span
                    className={
                      filterUnRead > 0
                        ? "absolute -right-1 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-red-500 px-1 text-[7px] font-semibold text-white shadow-sm"
                        : "absolute -right-1 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-emerald-500 px-1 text-[7px] font-semibold text-white shadow-sm"
                    }
                  >
                    <span className="flex items-center justify-center">
                      {filterUnRead}
                    </span>
                  </span>{" "}
                </div>
                Notifications
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  //setMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                {theme == "dark" ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonStar className="h-4 w-4" />
                )}
                Change Theme
              </button>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <SearchIcon className="h-4 w-4" />
                Search Projects
              </button>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 w-full border-t border-slate-200 p-5 dark:border-slate-800">
            {isLogin ? (
              <button
                onClick={() => {
                  logOutFunc();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
              >
                Login
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
