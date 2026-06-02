import { UserPlus } from "lucide-react";
import React, { useState } from "react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAllContexts } from "../context/AllContext";
import ButtonLoading from "./ButtonLoading";
import { clearAllProjects } from "../utils/cacheclear/personalised/clearAllProjects";
import { clearProjectDetails } from "../utils/cacheclear/shared/clearProjectDetails";
import { clearAllNotifications } from "../utils/cacheclear/personalised/clearNotifications";

function AddMemberModal({
  selectMember,
  projectId,
  allMembers,
  setMembers,
  setAddMemberModal,
  allCompanyMembers,
  setAllMembers,
}: any) {
  const { btnLoading, setBtnLoading, user } = useAllContexts();

  const [newMemberDesignation, setNewMemberDesignation] = useState<string>("");

  const addMember = async () => {
    try {
      if (!newMemberDesignation || newMemberDesignation.length < 2) {
        errorEmitter("Member's designation too short");
        return;
      }

      setBtnLoading(true);

      let response = await fetch(
        `${baseURL}/members/${projectId}/users/${selectMember._id}`,
        {
          method: "POST",
          body: JSON.stringify({
            forProject: projectId,
            user: selectMember,
            isAdmin: false,
            byUser: user._id,
            addedMs: Date.now(),
            designation: newMemberDesignation,
          }),
        },
      );

      let newMemberData = await response.json();

      if (newMemberData.success) {
        // successEmitter(newMemberData.message);

        setMembers([...allMembers, newMemberData.member]);

        setAllMembers(
          allCompanyMembers.map((elm: any) => {
            if (elm && elm._id != selectMember._id) {
              return elm;
            }
          }),
        );
        setBtnLoading(false);
        setAddMemberModal(false);
        await clearAllNotifications(selectMember._id);
        await clearAllProjects(selectMember._id);
        await clearProjectDetails(
          newMemberData.member.forProject,
          user.companyId._id,
        );
      } else errorEmitter(newMemberData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
      setAddMemberModal(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                <UserPlus className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Add Member
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Assign a role or designation to{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {selectMember.name}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Member Designation
                </span>

                <input
                  type="text"
                  required
                  value={newMemberDesignation}
                  onChange={(e) => {
                    setNewMemberDesignation(e.target.value);
                  }}
                  placeholder="e.g Frontend Developer"
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                />
              </label>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
                The selected employee will be added to this project with the
                designation specified above.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                disabled={btnLoading}
                onClick={() => {
                  setAddMemberModal(false);
                }}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                disabled={btnLoading}
                onClick={async () => {
                  await addMember();
                }}
                className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-indigo-500"
              >
                {btnLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    Adding Member <ButtonLoading />
                  </div>
                ) : (
                  "Add Member"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddMemberModal;
