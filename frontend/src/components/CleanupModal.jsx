import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, CircleCheck, Sparkles, Trash2, X } from "lucide-react";

export default function CleanupModal({ tasks, onClose, onDeleteAll, onDeleteSubtask, onDeleteParentDoneSubtasks }) {
  const groups = useMemo(
    () =>
      tasks
        .map((t) => ({ parent: t, doneSubtasks: (t.subtasks || []).filter((st) => st.completed) }))
        .filter((g) => g.doneSubtasks.length > 0),
    [tasks]
  );
  const totalDone = useMemo(() => groups.reduce((sum, g) => sum + g.doneSubtasks.length, 0), [groups]);
  const [expanded, setExpanded] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleGroup = (id) => setExpanded((m) => ({ ...m, [id]: !m[id] }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white w-full max-w-lg border border-zinc-900 shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 leading-none">Subtask Housekeeping</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Clean up completed subtasks to optimize local data storage</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {totalDone === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3">
                <CircleCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">All Clean!</h3>
              <p className="text-[11px] text-zinc-500 max-w-xs mt-1">
                There are currently no completed subtasks stored in your local storage.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Completed Subtasks Tree ({totalDone} done items across {groups.length} parent tasks)
                </span>
              </div>
              <div className="border border-zinc-200 divide-y divide-zinc-100 bg-white">
                {groups.map(({ parent, doneSubtasks }) => {
                  const isOpen = expanded[parent.id] ?? false;
                  return (
                    <div key={parent.id} className="flex flex-col">
                      <div
                        onClick={() => toggleGroup(parent.id)}
                        className="flex items-center justify-between p-2.5 bg-zinc-50/80 hover:bg-zinc-100/80 transition-colors cursor-pointer select-none border-b border-zinc-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className={`text-zinc-400 transition-transform duration-150 shrink-0 ${isOpen ? "" : "rotate-90"}`}>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-xs font-bold text-zinc-800 truncate">{parent.title || "Untitled Parent Task"}</span>
                          <span className="text-[9px] font-sans font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full shrink-0">
                            {doneSubtasks.length} done
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onDeleteParentDoneSubtasks(parent.id)}
                            className="text-[10px] text-zinc-400 hover:text-rose-600 font-medium hover:underline transition-colors px-1 py-0.5"
                            title="Clear all completed subtasks for this task"
                          >
                            Clear group
                          </button>
                        </div>
                      </div>
                      {!isOpen && (
                        <div className="pl-6 bg-white divide-y divide-zinc-50 border-t border-zinc-100">
                          {doneSubtasks.map((st) => (
                            <div key={st.id} className="py-2 pr-3 flex items-center justify-between gap-3 group hover:bg-zinc-50/80 transition-colors">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <CircleCheck className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                                <span className="text-xs font-medium text-zinc-500 line-through truncate">{st.title}</span>
                                {st.dueDate && <span className="text-[9px] text-zinc-400 shrink-0 font-sans font-bold">({st.dueDate})</span>}
                              </div>
                              <button
                                onClick={() => onDeleteSubtask(parent.id, st.id)}
                                className="p-1 text-zinc-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                title="Delete subtask"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between shrink-0">
          {confirmDelete ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 bg-rose-50 p-2.5 border border-rose-200">
              <span className="text-xs font-semibold text-rose-800">Permanently delete all {totalDone} done subtasks?</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 border border-rose-300 text-rose-700 bg-white text-xs font-bold uppercase tracking-wider hover:bg-rose-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onDeleteAll(); setConfirmDelete(false); }}
                  className="px-3 py-1.5 bg-rose-600 border border-rose-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-xs"
                >
                  Yes, Delete All
                </button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={onClose} className="px-4 py-2 border border-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors">
                Close
              </button>
              {totalDone > 0 && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 border border-rose-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />Delete All ({totalDone})
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}