"use client";

import React, { useState } from "react";
import { PencilLine } from "lucide-react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoading from "./ButtonLoading";
import { useAllContexts } from "../context/AllContext";
import { clearProjectDetails } from "../utils/cacheclear/shared/clearProjectDetails";

export default function EditDesignationModal({
  updateMember,
  setUpdateMember,
  setEditMemberModal,
  members,
  designation,
  setDesignation,
}: any) {
  const [btnLoad, setBtnLoad] = useState<boolean>(false);
  const { user, project } = useAllContexts();
  const changeDesignation = async () => {
    try {
      setBtnLoad(true);

      if (designation.toString().length < 3) {
        errorEmitter(
          "Designation too short, must be atleast 3 characters long",
        );
        return;
      }

      let response = await fetch(
        `${baseURL}/members/editmember/${updateMember._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            designation,
            companyId: user.companyId._id,
          }),
        },
      );

      let editData = await response.json();
      // console.log(editData);

      if (editData.success) {
        // successEmitter(editData.message);
        setEditMemberModal(false);
        members.map((elm: any) => {
          if (elm._id == updateMember._id) {
            elm.designation = designation;
          }
        });
        setBtnLoad(false);
        await clearProjectDetails(project._id, user.companyId._id);
      } else errorEmitter(editData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoad(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <PencilLine className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Edit member&apos;s designation
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Update the role or designation of this member.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Designation
              </span>

              <input
                type="text"
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                }}
                placeholder="Enter new designation"
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
            </label>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
              Keep the designation short, clear, and easy to understand for the
              team.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => {
                setEditMemberModal(false);
              }}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              disabled={btnLoad}
              onClick={async () => {
                await changeDesignation();
              }}
              className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-indigo-500"
            >
              {btnLoad ? (
                <div className="flex items-center justify-center gap-2">
                  Changing <ButtonLoading />
                </div>
              ) : (
                "Change"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
