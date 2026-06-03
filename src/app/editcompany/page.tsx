"use client";
import { Building2 } from "lucide-react";
import React, { useState } from "react";
import { useAllContexts } from "../context/AllContext";
import { useRouter } from "next/navigation";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoading from "../components/ButtonLoading";
import { isManager } from "../utils/isManager";

function EditCompany() {
  const router = useRouter();
  const {
    user,
    btnLoading,
    setBtnLoading,
    cancelLoading,
    setCancelLoading,
    setUser,
  } = useAllContexts();
  const [name, setName] = useState<string>(user.companyId.companyName);
  const [oldName, setoldName] = useState<string>(user.companyId.companyName);
  const [file, setfile] = useState<File[] | null[] | undefined[]>();
  const changeCompany = async () => {
    try {
      let result = await isManager(user._id);
      if (!result) {
        errorEmitter("Unauthorized access");
        return router.push("/companydetails");
      }
      if (!file && !name) {
        errorEmitter("Change atleast one value");
        return;
      }
      if (!name) {
        errorEmitter("Company Name can't be empty");
        return;
      }
      if (file) {
        setCancelLoading(true);
        await Promise.all(
          file.map(async (imageFile) => {
            const formData = new FormData();
            formData.append("image", imageFile as File);
            let uploadRes = await fetch(
              `${baseURL}/upload/company/${user._id}`,
              {
                method: "PUT",
                body: formData,
              },
            );
            let uploadData = await uploadRes.json();
            if (uploadData.success) {
              successEmitter(uploadData.message);
              localStorage.setItem(
                "localUser",
                JSON.stringify(uploadData.user),
              );
              setUser(uploadData.user);
            } else errorEmitter(uploadData.message);
          }),
        );
      }
      if (oldName != name) {
        setBtnLoading(true);
        let response = await fetch(`${baseURL}/company/${user._id}`, {
          method: "PUT",
          body: JSON.stringify({
            companyName: name,
          }),
        });
        let editData = await response.json();
        if (editData.success) {
          successEmitter(editData.message);
          localStorage.setItem("localUser", JSON.stringify(editData.user));
          setUser(editData.user);
        } else errorEmitter(editData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCancelLoading(false);
      setBtnLoading(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-6 py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Edit Company Details
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Update your company name and logo.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Company Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  required
                  placeholder="Enter company name"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Company Logo
                </label>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        setfile(Array.from(e.target.files));
                      }
                    }}
                    accept="image/*"
                    className="w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700 dark:text-slate-300"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Supported formats: JPG, PNG, WEBP
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Current Logo
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={user.companyId.companyPic}
                    alt="Company Logo"
                    className="h-16 w-16 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Company Logo Preview
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload a new image to replace it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  router.push("/companydetails");
                }}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                disabled={cancelLoading || btnLoading}
                onClick={async () => {
                  await changeCompany();
                }}
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
              >
                {btnLoading || cancelLoading ? (
                  <>
                    <div className="flex gap-2 items-center">
                      Saving Changes <ButtonLoading />
                    </div>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
}

export default EditCompany;
