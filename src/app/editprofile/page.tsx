"use client";

import { Settings, Upload, UserRound, ImageIcon } from "lucide-react";
import { useAllContexts } from "../context/AllContext";
import { useState } from "react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";
import ButtonLoading from "../components/ButtonLoading";
import { clearProfileData } from "../utils/cacheclear/personalised/clearProfileData";

export default function EditProfilePage() {
  let { user, btnLoading, setBtnLoading, setUser, getProfile } =
    useAllContexts();

  let [tempData, setTempData] = useState({
    name: user.name,
    profilepic: user.profilepic,
  });

  let onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempData({ ...tempData, [e.target.name]: e.target.value });
  };

  let [file, setFile] = useState<File | null | undefined>(null);

  const router = useRouter();

  let submitForm = async () => {
    try {
      setBtnLoading(true);

      let image = "";

      if (file) {
        let formData = new FormData();
        formData.append("image", file);

        let uploadRes = await fetch(`${baseURL}/upload`, {
          method: "POST",
          body: formData,
        });

        let uploadData = await uploadRes.json();
        // console.log(uploadData);

        if (uploadData.success) {
          image = uploadData.url;
        } else errorEmitter(uploadData.message);
      }

      if (image) {
        let response = await fetch(`${baseURL}/users/${user._id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: tempData.name,
            profilepic: image,
          }),
        });

        let editData = await response.json();
        // console.log(editData);

        if (editData.success) {
          // successEmitter(editData.message);
          localStorage.setItem("localUser", JSON.stringify(editData.user));
          setUser(editData.user);
          await clearProfileData(user._id);
          router.push("/");
        } else errorEmitter(editData.message);
      } else {
        let response = await fetch(`${baseURL}/users/${user._id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: tempData.name,
          }),
        });

        let editData = await response.json();
        // console.log(editData);

        if (editData.success) {
          // successEmitter(editData.message);
          localStorage.setItem("localUser", JSON.stringify(editData.user));
          setUser(editData.user);
          setBtnLoading(false);
          await clearProfileData(user._id);
          router.push("/profile");
        } else errorEmitter(editData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
        {/* Header */}

        <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-8 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <UserRound className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Edit Profile
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Update your personal information and profile picture.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}

        <div className="p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40 md:flex-row md:items-center">
            <div className="relative">
              <img
                src={user?.profilepic}
                alt="Profile"
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg dark:border-slate-800"
              />

              <div className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 p-2 text-white shadow-md">
                <ImageIcon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex-1">
              <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Profile Picture
              </label>

              <label htmlFor="clicktag">
                <div className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500">
                  <Upload className="h-4 w-4" />
                  Change Picture
                </div>
              </label>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                JPG, PNG supported. Recommended square image for best results.
              </p>

              {file && (
                <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {file.name}
                </div>
              )}

              <input
                type="file"
                id="clicktag"
                onChange={(e) => {
                  setFile(e.target.files?.[0]);
                }}
                className="hidden"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={tempData.name}
              onChange={onChangeFunc}
              placeholder="John Doe"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
            />
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              Changes made here will update your public profile information
              across the workspace.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => router.push("/changecredentials")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md dark:hover:bg-indigo-500"
            >
              <Settings className="h-4 w-4" />
              Change Credentials
            </button>

            <button
              disabled={btnLoading}
              onClick={() => router.push("/profile")}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              disabled={btnLoading}
              onClick={async () => {
                await submitForm();
              }}
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-emerald-500"
            >
              {btnLoading ? (
                <div className="flex items-center justify-center gap-2">
                  Saving Changes <ButtonLoading />
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
