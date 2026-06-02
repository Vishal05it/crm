import React from "react";
import { Plus } from "lucide-react";
import { baseURL } from "../utils/baseURL";

type User = {
  _id: string;
  email: string;
  name: string;
  profilepic: string;
  companyId: string;
  isManager: boolean;
  createdAt: string;
};

type Member = {
  _id: string;
  user: User;
  name: string;
  forProject: string;
  isAdmin: boolean;
  designation: string;
};

type Props = {
  member: User;
  setSelectMember: React.Dispatch<React.SetStateAction<User | undefined>>;
  setAddMemberModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function MemberCard({ member, setSelectMember, setAddMemberModal }: Props) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-indigo-500/30">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={member?.profilepic}
          alt={member.name}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
            {member.name}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            Tap to add to project
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setSelectMember(member);
          setAddMemberModal(true);
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm transition-all duration-200 opacity-100 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Add ${member.name}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default MemberCard;
