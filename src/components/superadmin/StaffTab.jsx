import { UserPlus, Edit3, Trash2, ShieldCheck, Mail } from 'lucide-react';

export const StaffTab = ({
  staff,
  onOpenInviteModal,
  onEditStaff,
  onDeleteStaff,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Staff & Permissions</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Assign venue roles, counter responsibilities, and manage employee access
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenInviteModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs transition-all shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    member.role === 'superadmin'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {member.role}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 flex items-center justify-center font-bold text-sm">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                    {member.name}
                  </h3>
                  <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {member.email}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Assigned Venue:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{member.assignedVenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Counter Desk:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{member.assignedCounter || 'All Desks'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => onEditStaff(member)}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 text-xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteStaff(member.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffTab;
