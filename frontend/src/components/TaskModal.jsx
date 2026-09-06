import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  CircleCheck,
  CirclePlus,
  EllipsisVertical,
  LayoutGrid,
  Trash2,
  X,
} from "lucide-react";
import { QUADRANT_CONFIG } from "../config.js";

const sortSubtasks = (a, b) =>
  a.dueDate && b.dueDate ? a.dueDate.localeCompare(b.dueDate)
    : a.dueDate ? -1
    : b.dueDate ? 1
    : 0;

export default function TaskModal({ task, onClose, onSave, onDelete, readOnly }) {
  const [draft, setDraft] = useState({ ...task });
  const [newSubtask, setNewSubtask] = useState("");
  const [doneCollapsed, setDoneCollapsed] = useState(true);

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const st = { id: crypto.randomUUID(), title: newSubtask, completed: false };
    setDraft((d) => ({ ...d, subtasks: [...d.subtasks, st] }));
    setNewSubtask("");
  };

  const toggleSubtask = (id) =>
    setDraft((d) => ({
      ...d,
      subtasks: d.subtasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed, completedAt: st.completed ? undefined : Date.now() } : st
      ),
    }));

  const deleteSubtask = (id) => setDraft((d) => ({ ...d, subtasks: d.subtasks.filter((st) => st.id !== id) }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-2xl border border-zinc-900 shadow-2xl flex flex-col max-h-[95vh] rounded-none"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">T</div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{readOnly ? "Task Details" : "Edit Task Details"}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-200 rounded transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <section className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Task Title</label>
              <input
                autoFocus
                type="text"
                placeholder="Enter task title..."
                className="w-full text-2xl font-bold text-zinc-900 border-b border-zinc-100 focus:border-zinc-900 focus:ring-0 placeholder:text-zinc-200 p-0 py-2 transition-all"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Description</label>
              <textarea
                placeholder="Describe the task details here..."
                className="w-full text-sm text-zinc-600 border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-zinc-300 focus:ring-0 placeholder:text-zinc-300 p-4 min-h-[100px] resize-none transition-all"
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />Due Date
              </label>
              <input
                type="date"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-2.5 text-xs font-bold text-zinc-800 focus:border-zinc-900 transition-all outline-none"
                value={draft.dueDate || ""}
                onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5" />Eisenhower Quadrant
              </label>
              <select
                className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-2.5 text-xs font-bold text-zinc-800 appearance-none focus:border-zinc-900 transition-all outline-none cursor-pointer uppercase tracking-tight"
                value={draft.quadrantId}
                onChange={(e) => setDraft((d) => ({ ...d, quadrantId: e.target.value }))}
                disabled={readOnly}
              >
                {QUADRANT_CONFIG.map((q) => (
                  <option key={q.id} value={q.id}>{q.title} - {q.subtitle}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 py-2">
              <button
                disabled={readOnly}
                onClick={() => setDraft((d) => ({ ...d, supportNeeded: !d.supportNeeded }))}
                className={`flex items-center gap-3 px-4 py-3 border transition-all w-full md:w-auto ${draft.supportNeeded ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-zinc-50 border-zinc-200 text-zinc-400"}`}
              >
                <div className={`w-4 h-4 border flex items-center justify-center ${draft.supportNeeded ? "bg-amber-500 border-amber-600" : "border-zinc-300"}`}>
                  {draft.supportNeeded && <CircleCheck className="w-3 h-3 text-white" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Support Needed From Others</span>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <CirclePlus className="w-3.5 h-3.5" />Subtasks
            </label>
            <div className="space-y-3">
              {!readOnly && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a new subtask..."
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-none px-4 py-2 text-xs focus:border-zinc-900 outline-none transition-all"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                  />
                  <button
                    onClick={addSubtask}
                    className="px-6 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    Add
                  </button>
                </div>
              )}

              {draft.subtasks.length > 0 && (
                <div className="space-y-1 divide-y divide-zinc-50 pt-2 border border-zinc-100">
                  {draft.subtasks.filter((st) => !st.completed).sort(sortSubtasks).map((st) => (
                    <div key={st.id} className="flex flex-col group px-4 py-3 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleSubtask(st.id)} className="shrink-0 transition-transform active:scale-75" disabled={readOnly}>
                          {st.completed ? <CircleCheck className="w-4 h-4 text-zinc-900" /> : <div className="w-4 h-4 border border-zinc-300" />}
                        </button>
                        <input
                          type="text"
                          className={`flex-1 text-xs font-medium bg-transparent border-none focus:ring-0 p-0 ${st.completed ? "line-through text-zinc-300" : "text-zinc-700"} ${readOnly ? "cursor-default" : ""}`}
                          value={st.title}
                          onChange={(e) => {
                            const v = e.target.value;
                            setDraft((d) => ({ ...d, subtasks: d.subtasks.map((x) => x.id === st.id ? { ...x, title: v } : x) }));
                          }}
                          disabled={readOnly}
                        />
                        <input
                          type="date"
                          className="text-[10px] bg-transparent border-none focus:ring-0 p-0 text-zinc-400 font-sans"
                          value={st.dueDate || ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setDraft((d) => ({ ...d, subtasks: d.subtasks.map((x) => x.id === st.id ? { ...x, dueDate: v } : x) }));
                          }}
                          disabled={readOnly}
                        />
                        {!readOnly && (
                          <button onClick={() => deleteSubtask(st.id)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-300 hover:text-rose-500 transition-all font-bold">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {draft.subtasks.some((st) => st.completed) && (
                    <div className="pt-1 select-none">
                      <button
                        onClick={() => setDoneCollapsed(!doneCollapsed)}
                        className="w-full flex items-center justify-between px-4 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer border-t border-b border-zinc-100"
                      >
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-150 ${doneCollapsed ? "" : "rotate-90"}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Done</span >
                        </div>
                        <span className="text-[9px] font-sans font-bold bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full leading-none">
                          {draft.subtasks.filter((st) => st.completed).length}
                        </span>
                      </button>
                      {!doneCollapsed && (
                        <div className="divide-y divide-zinc-50 bg-zinc-50/10">
                          {draft.subtasks.filter((st) => st.completed).sort(sortSubtasks).map((st) => (
                            <div key={st.id} className="flex flex-col group px-4 py-2 hover:bg-zinc-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <button onClick={() => toggleSubtask(st.id)} className="shrink-0 transition-transform active:scale-75" disabled={readOnly}>
                                  {st.completed ? <CircleCheck className="w-4 h-4 text-zinc-900" /> : <div className="w-4 h-4 border border-zinc-300" />}
                                </button>
                                <input
                                  type="text"
                                  className={`flex-1 text-xs font-medium bg-transparent border-none focus:ring-0 p-0 ${st.completed ? "line-through text-zinc-400" : "text-zinc-700"} ${readOnly ? "cursor-default" : ""}`}
                                  value={st.title}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setDraft((d) => ({ ...d, subtasks: d.subtasks.map((x) => x.id === st.id ? { ...x, title: v } : x) }));
                                  }}
                                  disabled={readOnly}
                                />
                                <input
                                  type="date"
                                  className="text-[10px] bg-transparent border-none focus:ring-0 p-0 text-zinc-400 font-sans"
                                  value={st.dueDate || ""}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setDraft((d) => ({ ...d, subtasks: d.subtasks.map((x) => x.id === st.id ? { ...x, dueDate: v } : x) }));
                                  }}
                                  disabled={readOnly}
                                />
                                {!readOnly && (
                                  <button onClick={() => deleteSubtask(st.id)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-300 hover:text-rose-500 transition-all font-bold">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <EllipsisVertical className="w-3.5 h-3.5" />Notes
            </label>
            <textarea
              placeholder="Reflections, blockers, or reference links..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-4 text-xs text-zinc-600 focus:bg-white focus:border-zinc-900 outline-none min-h-[140px] transition-all font-sans"
              value={draft.notes || ""}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              disabled={readOnly}
            />
          </section>
        </div>

        <div className="px-8 py-6 border-t border-zinc-200 flex items-center justify-between bg-zinc-50">
          {!readOnly && (
            <button
              onClick={() => { if (window.confirm("Are you sure you want to delete this task? This action is irreversible.")) onDelete(draft.id); }}
              className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-rose-600 transition-all uppercase tracking-widest"
            >
              <Trash2 className="w-3.5 h-3.5" />Delete Task
            </button>
          )}
          <div className="flex items-center gap-4">
            {!readOnly ? (
              <>
                <button onClick={onClose} className="px-6 py-2 text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-all uppercase tracking-widest">
                  Cancel
                </button>
                <button
                  onClick={() => onSave(draft)}
                  className="px-10 py-3 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-zinc-200 hover:bg-black transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button onClick={onClose} className="px-10 py-3 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-zinc-200 hover:bg-black transition-all active:scale-95">
                Close
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
