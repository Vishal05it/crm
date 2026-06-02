"use client";

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

type Project = {
  _id: string;
  title: string;
  description: string;
  createdMs: number;
  isFailed: boolean;
  deadline: number;
  deadlineDate: string;
  addedMs: number;
  createdBy: string;
  updatedAt: string;
  isDone: boolean;
};

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  PenLine,
  CalendarDays,
  FolderEdit,
} from "lucide-react";
import Link from "next/link";
import { useAllContexts } from "../../../context/AllContext";
import UnauthorizedAccessPage from "../../../components/Unauthorized";
import { useParams, useRouter } from "next/navigation";
import { baseURL } from "@/app/utils/baseURL";
import { errorEmitter, successEmitter } from "@/app/utils/emitter";
import Loader from "@/app/loading";
import ButtonLoading from "@/app/components/ButtonLoading";
import { clearAllProjects } from "@/app/utils/cacheclear/personalised/clearAllProjects";
import { clearProjectDetails } from "@/app/utils/cacheclear/shared/clearProjectDetails";

export default function EditProjectPage() {
  const {
    user,
    pageLoading,
    setPageLoading,
    btnLoading,
    setBtnLoading,
    cancelLoading,
    project,
    setProject,
    setAllProjects,
    setAllTempProjects,
    setActiveCount,
    setCompleteCount,
    setprevProject,
    members,
    images,
    setImages,
  } = useAllContexts();

  const param = useParams();
  const router = useRouter();

  const [currMember, setCurrMember] = useState<Members>();
  const [files, setFiles] = useState<File[] | undefined | null>();

  const getMember = async () => {
    try {
      setPageLoading(true);

      let response = await fetch(
        `${baseURL}/members/${param.projectId}/members/${param.memberId}`,
      );

      let memberData = await response.json();

      // console.log(memberData);

      if (memberData.success) {
        // successEmitter(memberData.message);
        setCurrMember(memberData.member);
      } else errorEmitter(memberData.message);

      setPageLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const getProjectDetails = async () => {
    try {
      setPageLoading(true);

      let response = await fetch(
        `${baseURL}/projects/projectdetails/${param.projectId}/${user.companyId._id}`,
      );

      let projectData = await response.json();

      // console.log(projectData);

      if (projectData.success) {
        setProject(projectData.project);
      } else errorEmitter(projectData.message);

      setPageLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const onChangeFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const editProject = async () => {
    try {
      setBtnLoading(true);

      if (files) {
        if (files.length > 0) {
          files.map(async (elm) => {
            let formData = new FormData();
            formData.append("image", elm);

            let imgRes = await fetch(
              `${baseURL}/uploadmultiple/${project._id}`,
              {
                method: "PUT",
                body: formData,
              },
            );

            let imgData = await imgRes.json();
            //console.log(imgData);
            if (imgData.success) {
              setprevProject("");
              setImages([...images, imgData.newImgDoc]);
            }
          });
        }
      }

      let response = await fetch(
        `${baseURL}/projects/projectdetails/${project._id}/${user.companyId._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: project.title,
            description: project.description,
            deadlineDate: project.deadlineDate,
            isDone: project.isDone,
            isFailed: project.isFailed,
            addedMs: Date.now(),
            userId: user._id,
          }),
        },
      );

      let editData = await response.json();

      // console.log(editData);

      if (editData.success) {
        // successEmitter(editData.message);
        setProject(editData.project);
        setBtnLoading(false);

        await clearProjectDetails(project._id, user.companyId._id);

        await Promise.all(
          members.map(async (member) => {
            await clearAllProjects(member.user._id);
          }),
        );

        let newResponse = await fetch(
          `${baseURL}/projects/findprojects/${user._id}`,
        );

        let allProjectsData = await newResponse.json();

        // console.log(allProjectsData);

        if (allProjectsData.success) {
          //successEmitter(allProjectsData.message);

          setAllProjects(allProjectsData.allProjects);
          setAllTempProjects(allProjectsData.allProjects);
          setActiveCount(allProjectsData.activeCount);
          setCompleteCount(allProjectsData.completeCount);
        }

        router.push(`/projects/${project._id}`);
      } else errorEmitter(editData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const fetchMember = async () => {
      await getMember();
      await getProjectDetails();
    };

    fetchMember();
  }, []);

  return (
    <>
      {currMember?.isAdmin ? (
        <>
          {pageLoading ? (
            <Loader />
          ) : (
            <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-black dark:via-slate-950 dark:to-black">
              <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                  <Link
                    href={`/projects/${project._id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>

                  <div className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm">
                    Project Admin
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950/90">
                  {/* Header */}

                  <div className="border-b border-slate-200 bg-linear-to-r from-indigo-50 via-white to-indigo-50 px-8 py-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                        <FolderEdit className="h-8 w-8" />
                      </div>

                      <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                          Edit Project
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Update project information and upload additional
                          project assets.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}

                  <div className="p-6 md:p-8">
                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Project Title
                        </label>

                        <input
                          type="text"
                          name="title"
                          value={project.title}
                          onChange={onChangeFunc}
                          placeholder="Enter project title"
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <CalendarDays className="h-4 w-4" />
                          Project Deadline
                        </label>

                        <input
                          type="text"
                          name="deadlineDate"
                          value={project.deadlineDate}
                          onChange={onChangeFunc}
                          placeholder="Enter project deadline"
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Project Description
                        </label>

                        <textarea
                          rows={6}
                          name="description"
                          onChange={onChangeFunc}
                          value={project.description}
                          placeholder="Write project description"
                          className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <ImagePlus className="h-4 w-4 text-slate-500 dark:text-slate-400" />

                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Upload Additional Images
                          </span>
                        </div>

                        <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-indigo-500 dark:hover:bg-slate-900">
                          <div className="flex flex-col items-center justify-center gap-3 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                              <Upload className="h-6 w-6" />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Click to upload images
                              </p>

                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                PNG, JPG and JPEG supported
                              </p>
                            </div>

                            {files && files.length > 0 && (
                              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                {files.length} image(s) selected
                              </div>
                            )}
                          </div>

                          <input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files) {
                                setFiles(Array.from(e.target.files));
                              }
                            }}
                            multiple
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                        <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                          Changes made here will be visible to all project
                          members after saving.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        disabled={cancelLoading}
                        onClick={() => router.push(`/projects/${project._id}`)}
                        className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {cancelLoading ? "Cancelling..." : "Cancel"}
                      </button>

                      <button
                        disabled={btnLoading}
                        onClick={editProject}
                        className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-indigo-500"
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
            </div>
          )}
        </>
      ) : (
        <UnauthorizedAccessPage />
      )}
    </>
  );
}
