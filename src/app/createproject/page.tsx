"use client";

import { Upload, CalendarDays, FileImage, FolderPlus } from "lucide-react";
import React, { useState } from "react";
import { useAllContexts } from "../context/AllContext";
import { baseURL } from "../utils/baseURL";
import { deadLineCalc } from "../utils/DeadlineCalc";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";
import ButtonLoading from "../components/ButtonLoading";

type Project = {
  title: string;
  description: string;
  deadlineDate: string;
  designation: string;
  required: string;
  forCompany: string;
};

export default function CreateProjectPage() {
  const router = useRouter();

  let [project, setProject] = useState<Project>({
    title: "",
    description: "",
    deadlineDate: "00-00-0000",
    designation: "",
    forCompany: "",
    required: "00-00-0000",
  });

  let [files, setFiles] = useState<File[] | null | undefined>([]);

  let onChangeFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  let { btnLoading, setBtnLoading, user } = useAllContexts();

  let submitForm = async () => {
    try {
      setBtnLoading(true);

      if (files?.length == 0) {
        errorEmitter("Upload atleast 1 image to create a project");
        return;
      }

      if (deadLineCalc(project.deadlineDate) <= 0) {
        errorEmitter("Deadline must be greater than 0 days");
        return;
      }
      if (!project.title || !project.description) {
        errorEmitter("Title & Description both are required");
        return;
      }
      if (deadLineCalc(project.deadlineDate) < deadLineCalc(project.required)) {
        errorEmitter("More time is required to finish the project");
        return;
      }

      let response = await fetch(
        `${baseURL}/projects/findprojects/${user._id}`,
        {
          method: "POST",
          body: JSON.stringify({
            title: project.title,
            description: project.description,
            designation: project.designation,
            deadlineDate: project.deadlineDate,
            createdMs: Date.now(),
            deadline: deadLineCalc(project.deadlineDate),
            addedMs: Date.now(),
            createdBy: user?._id,
            forCompany: user.companyId,
            required: deadLineCalc(project.required),
          }),
        },
      );

      let projectData = await response.json();
      // console.log(projectData);

      if (projectData.success) {
        setProject({
          title: "",
          description: "",
          deadlineDate: "00-00-0000",
          designation: "",
          forCompany: "",
          required: "00-00-0000",
        });

        if (files) {
          if (files?.length > 0) {
            files.map(async (elm) => {
              let formData = new FormData();
              formData.append("image", elm);
              formData.append("user", user._id);

              let uploadRes = await fetch(
                `${baseURL}/uploadmultiple/${projectData.pendingProject._id}`,
                {
                  method: "POST",
                  body: formData,
                },
              );

              let uploadImagesData = await uploadRes.json();
              // console.log(uploadImagesData);
            });
          }
        }
        successEmitter(projectData.message);
        router.push("/");
      } else errorEmitter(projectData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
        {/* Header */}

        <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-8 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <FolderPlus className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Create Project
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Fill in the details below to submit a new project for approval.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await submitForm();
          }}
          className="p-6 md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Project Title
              </label>

              <input
                type="text"
                name="title"
                value={project.title}
                required
                onChange={onChangeFunc}
                placeholder="Enter project title"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Your Designation
              </label>

              <input
                type="text"
                name="designation"
                required
                value={project.designation}
                onChange={onChangeFunc}
                placeholder="Enter your designation"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              required
              value={project.description}
              onChange={onChangeFunc}
              placeholder="Describe the project goals, scope and requirements..."
              className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
            />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <CalendarDays className="h-4 w-4" />
                Required Completion Date
              </label>

              <input
                type="date"
                name="required"
                required
                value={project.required}
                onChange={(e) => {
                  onChangeFunc(e);
                  // console.log(deadLineCalc(e.target.value));
                }}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <CalendarDays className="h-4 w-4" />
                Final Deadline
              </label>

              <input
                type="date"
                required
                name="deadlineDate"
                value={project.deadlineDate}
                onChange={onChangeFunc}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Project Images
            </label>

            <label
              htmlFor="uploadpics"
              className="block cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-indigo-500 dark:hover:bg-slate-900"
            >
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                  <Upload className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Click to upload project images
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG and multiple files supported
                  </p>
                </div>

                {files && files.length > 0 && (
                  <div className="mt-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {files.length} image(s) selected
                  </div>
                )}
              </div>
            </label>

            <input
              id="uploadpics"
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(Array.from(e.target.files));
                }
              }}
              type="file"
              multiple
              className="hidden"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <div className="flex items-start gap-3">
              <FileImage className="mt-0.5 h-4 w-4 text-indigo-600 dark:text-indigo-400" />

              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                Upload clear images related to the project requirements.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={btnLoading}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={btnLoading}
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-indigo-500"
            >
              {btnLoading ? (
                <div className="flex items-center justify-center gap-2">
                  Creating Project <ButtonLoading />
                </div>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
