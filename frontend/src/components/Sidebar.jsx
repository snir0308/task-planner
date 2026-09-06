import { useMemo, useState } from "react";
import { ChevronRight, CircleCheck, Inbox, Pen, Trash2 } from "lucide-react";
import { QUADRANTS } from "../config.js";

export default function Sidebar({ tasks, onEditTask, setTasks, readOnly, hoveredTaskId }) {
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [activeTab, setActiveTab] = useState("priorities");
  const [expandedParents, setExpandedParents] = useState({});

  const toggleExpanded = (id) => setExpandedParents((m) => ({ ...m, [id]: !m[id] }));

  const startEdit = (task) => {
    if (readOnly) return;
    setEditingId(task.id);
    setDraftTitle(task.title);
  };

  const commitEdit = (id) => {
    if (readOnly) return;
    const trimmed = draftTitle.trim();
    if (trimmed) setTasks((t) => t.map((x) => (x.id === id ? { ...x, title: trimmed } : x)));
    setEditingId(null);
  };

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const nextWeek = new Date(now);
  const daysToNextWeekEnd = now.getDay() === 0 ? 1 : 8 - now.getDay();
  nextWeek.setDate(now.getDate() + daysToNextWeekEnd);
  const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, "0")}-${String(nextWeek.getDate()).padStart(2, "0")}`;

  const flatPriorities = useMemo(() => {
    const items = [];
    tasks.forEach((t) => {
      t.subtasks.forEach((st) => {
        const completed = st.completed;
        if (!!st.dueDate && (!completed || (st.completedAt && st.completedAt >= weekStart.getTime()))) {
          items.push({ subtask: st, parent: t });
        }
      });
    });
    items.sort((a, b) => (a.subtask.dueDate || "9999-12-31").localeCompare(b.subtask.dueDate || "9999-12-31"));
    return items;
  }, [tasks, weekStart]);

  const groupedPriorities = useMemo(() => {
    const groups = [];
    tasks.forEach((t) => {
      const sub = [];
      t.subtasks.forEach((st) => {
        const completed = st.completed;
        if (!!st.dueDate && (!completed || (st.completedAt && st.completedAt >= weekStart.getTime()))) sub.push(st);
      });
      if (sub.length > 0) {
        sub.sort((a, b) => (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31"));
        groups.push({ parent: t, subtasks: sub });
      }
    });
    groups.sort((a, b) => (a.subtasks[0]?.dueDate || "9999-12-31").localeCompare(b.subtasks[0]?.dueDate || "9999-12-31"));
    return groups;
  }, [tasks, weekStart]);

  const supportTasks = useMemo(
    () => tasks.filter((t) => (t.supportNeeded ? (t.completed ? t.completedAt && t.completedAt >= weekStart.getTime() : true) : false)),
    [tasks, weekStart]
  );
  const parkingTasks = useMemo(
    () => tasks.filter((t) => (t.parkingLot ? (t.completed ? t.completedAt && t.completedAt >= weekStart.getTime() : true) : false)),
    [tasks, weekStart]
  );

  const toggleSubtask = (taskId, subtaskId) => {
    if (readOnly) return;
    setTasks((t) =>
      t.map((x) =>
        x.id === taskId
          ? { ...x, subtasks: x.subtasks.map((st) => {
              if (st.id === subtaskId) {
                const completed = !st.completed;
                return { ...st, completed, completedAt: completed ? Date.now() : undefined };
              }
              return st;
            }) }
          : x
      )
    );
  };

  const toggleSupport = (id) => {
    if (readOnly) return;
    setTasks((t) =>
      t.map((x) => (x.id === id ? { ...x, completed: !x.completed, completedAt: x.completed ? undefined : Date.now() } : x))
    );
  };

  const toggleParking = (id) => toggleSupport(id);

  const deleteItem = (id) => {
    if (readOnly) return;
    setTasks((t) => t.filter((x) => x.id !== id));
  };

  const activePriorityCount = flatPriorities.filter((p) => !p.subtask.completed).length;
  const pendingSupportCount = supportTasks.filter((t) => !t.completed).length;
  const pendingParkingCount = parkingTasks.filter((t) => !t.completed).length;

  const tabButtonClass = (tab) =>
    `flex flex-col items-center justify-center gap-1 py-2 px-1 border-b-2 transition-all cursor-pointer ${
      activeTab === tab ? "border-zinc-900 bg-white text-zinc-950 font-bold" : "border-transparent text-zinc-400 hover:text-zinc-600 font-medium"
    }`;
  const badgeClass = (tab) =>
    `text-[8px] px-1.5 py-0.5 rounded-full font-sans font-bold leading-none ${
      activeTab === tab ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
    }`;

  return (
    <aside className="w-full lg:w-80 h-full flex flex-col overflow-hidden shrink-0 bg-white border border-zinc-200 shadow-sm">
      <div className="grid grid-cols-3 border-b border-zinc-200 bg-zinc-50/50 shrink-0 select-none">
        <button onClick={() => setActiveTab("priorities")} className={tabButtonClass("priorities")}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
            <span className="text-[9px] uppercase tracking-wider">Priorities</span>
          </div>
          <span className={badgeClass("priorities")}>{activePriorityCount}</span>
        </button>
        <button onClick={() => setActiveTab("support")} className={tabButtonClass("support")}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
            <span className="text-[9px] uppercase tracking-wider">Support</span>
          </div>
          <span className={badgeClass("support")}>{pendingSupportCount}</span>
        </button>
        <button onClick={() => setActiveTab("parking")} className={tabButtonClass("parking")}>
          <div className="flex items-center gap-1.5">
            <Inbox className={`w-3 h-3 shrink-0 ${activeTab === "parking" ? "text-indigo-500" : "text-zinc-400"}`} />
            <span className="text-[9px] uppercase tracking-wider">Parking</span>
          </div>
          <span className={badgeClass("parking")}>{pendingParkingCount}</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
        {activeTab === "priorities" && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between shrink-0">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />Top Priorities
              </h2>
              <span className="text-[9px] font-sans font-bold text-zinc-400">
                {flatPriorities.filter((p) => !p.subtask.completed).length} active
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {groupedPriorities.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic py-8">
                  No immediate priorities
                </div>
              ) : (
                groupedPriorities.map(({ parent, subtasks }) => {
                  const isExpanded = expandedParents[parent.id] ?? false;
                  const isHovered = parent.id === hoveredTaskId;
                  return (
                    <div key={parent.id} className="flex flex-col">
                      <div
                        className={`flex items-center gap-1.5 py-1 px-1.5 rounded-sm select-none transition-all ${
                          isHovered
                            ? "bg-rose-50/80 text-rose-900 font-semibold shadow-sm"
                            : readOnly ? "cursor-default" : "cursor-pointer text-zinc-600 hover:text-zinc-950"
                        }`}
                        onClick={() => toggleExpanded(parent.id)}
                      >
                        <span className={`shrink-0 transition-transform duration-150 ${isHovered ? "text-rose-500" : "text-zinc-400"} ${isExpanded ? "" : "rotate-90"}`}>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                        <span className="text-[10px] font-bold tracking-wider uppercase truncate">{parent.title}</span>
                      </div>
                      {!isExpanded && (
                        <div className="pl-4.5 flex flex-col">
                          {subtasks.map((st) => {
                            const isFuture = !!st.dueDate && st.dueDate >= nextWeekStr;
                            return (
                              <div
                                key={st.id}
                                className={`py-1 flex items-center gap-2 border-b border-zinc-100 last:border-b-0 transition-all ${
                                  st.completed ? "opacity-60" : ""
                                } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                                onClick={() => onEditTask(parent)}
                              >
                                <div className="shrink-0 flex items-center">
                                  <button
                                    disabled={readOnly}
                                    onClick={(e) => { e.stopPropagation(); toggleSubtask(parent.id, st.id); }}
                                    className={`shrink-0 transition-transform ${readOnly ? "" : "active:scale-75"}`}
                                  >
                                    {st.completed ? (
                                      <CircleCheck className="w-3.5 h-3.5 text-zinc-950" />
                                    ) : (
                                      <div className="w-3.5 h-3.5 border border-zinc-350 bg-white" />
                                    )}
                                  </button>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[11px] font-medium truncate leading-tight ${
                                    st.completed ? "line-through text-zinc-400" : isFuture ? "text-zinc-400" : "text-zinc-800"
                                  }`}>
                                    {st.title}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between shrink-0">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />Support Needed
              </h2>
              <span className="text-[9px] font-sans font-bold text-zinc-400">{pendingSupportCount} pending</span>
            </div>
            {!readOnly && (
              <div className="px-2 py-2 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
                <input
                  type="text"
                  placeholder="Add quick support task..."
                  className="w-full bg-white border border-zinc-200 px-3 py-1.5 text-xs outline-none transition-all placeholder:text-zinc-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = e.target.value;
                      if (!val.trim()) return;
                      const newTask = {
                        id: crypto.randomUUID(),
                        title: val,
                        description: "",
                        quadrantId: QUADRANTS.URGENT_NOT_IMPORTANT,
                        subtasks: [],
                        createdAt: Date.now(),
                        completed: false,
                        supportNeeded: true,
                        isSimple: true,
                      };
                      setTasks((t) => [...t, newTask]);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {supportTasks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic py-8">
                  No pending support requests
                </div>
              ) : (
                supportTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`group p-2 border transition-all flex items-center gap-3 ${
                      t.completed ? "bg-zinc-50/50 opacity-60 border-zinc-100" : "bg-amber-50/10 border-zinc-100"
                    } ${readOnly ? "cursor-default" : "hover:border-zinc-200"} ${!t.isSimple && !readOnly ? "cursor-pointer" : ""}`}
                     onClick={() => !t.isSimple && onEditTask(t)}

                  >
                    <button
                      disabled={readOnly}
                      onClick={(e) => { e.stopPropagation(); toggleSupport(t.id); }}
                      className={`shrink-0 transition-transform ${readOnly ? "" : "active:scale-75"}`}
                    >
                      {t.completed ? (
                        <CircleCheck className="w-3.5 h-3.5 text-zinc-900" />
                      ) : (
                        <div className="w-3.5 h-3.5 border border-amber-300 flex items-center justify-center bg-white" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                      {editingId === t.id ? (
                        <input
                          type="text"
                          className="w-full bg-white border border-zinc-300 px-2 py-0.5 text-[11px] font-bold text-zinc-800 outline-none focus:ring-1 focus:ring-zinc-900"
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          onBlur={() => commitEdit(t.id)}
                          onKeyDown={(e) => { e.key === "Enter" ? commitEdit(t.id) : e.key === "Escape" && setEditingId(null); }}
                          autoFocus
                        />
                      ) : (
                        <>
                               <p
                                  className={`text-[11px] font-bold truncate leading-tight ${t.completed ? "line-through text-zinc-400" : "text-amber-900"} ${readOnly ? "" : "hover:underline cursor-text"}`}
                                  onClick={() => onEditTask(t)}
                                >
                                  {t.title}
                                </p>

                          {!t.isSimple && <p className="text-[9px] text-amber-700/60 line-clamp-1 italic">{t.description || "Requires collaboration"}</p>}
                        </>
                      )}
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); startEdit(t); }} className="p-1 text-zinc-300 hover:text-zinc-600 transition-colors" title="Edit Item">
                          <Pen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (window.confirm("Are you sure you want to delete this support request?")) deleteItem(t.id); }}
                          className="p-1 text-zinc-300 hover:text-rose-500 transition-colors mr-1"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "parking" && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between shrink-0">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />Parking Lot
              </h2>
              <span className="text-[9px] font-sans font-bold text-zinc-400">{pendingParkingCount} items</span>
            </div>
            {!readOnly && (
              <div className="px-2 py-2 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
                <input
                  type="text"
                  placeholder="Add quick parking lot item..."
                  className="w-full bg-white border border-zinc-200 px-3 py-1.5 text-xs outline-none transition-all placeholder:text-zinc-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = e.target.value;
                      if (!val.trim()) return;
                      const newTask = {
                        id: crypto.randomUUID(),
                        title: val,
                        description: "",
                        quadrantId: QUADRANTS.NOT_URGENT_NOT_IMPORTANT,
                        subtasks: [],
                        createdAt: Date.now(),
                        completed: false,
                        supportNeeded: false,
                        parkingLot: true,
                        isSimple: true,
                      };
                      setTasks((t) => [...t, newTask]);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {parkingTasks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic py-8">
                  Parking lot is empty
                </div>
              ) : (
                parkingTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`group p-2 border transition-all flex items-center gap-3 ${
                      t.completed ? "bg-zinc-50/50 opacity-60 border-zinc-100" : "bg-white border-zinc-100"
                    } ${readOnly ? "cursor-default" : "hover:border-zinc-200"} ${readOnly ? "" : "cursor-text"}`}
                  >
                    <button
                      disabled={readOnly}
                      onClick={(e) => { e.stopPropagation(); toggleParking(t.id); }}
                      className={`shrink-0 transition-transform ${readOnly ? "" : "active:scale-75"}`}
                    >
                      {t.completed ? (
                        <CircleCheck className="w-3.5 h-3.5 text-zinc-900" />
                      ) : (
                        <div className="w-3.5 h-3.5 border border-zinc-300 flex items-center justify-center bg-white rounded-none" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                      {editingId === t.id ? (
                        <input
                          type="text"
                          className="w-full bg-white border border-zinc-300 px-2 py-0.5 text-[11px] font-bold text-zinc-800 outline-none focus:ring-1 focus:ring-zinc-900"
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          onBlur={() => commitEdit(t.id)}
                          onKeyDown={(e) => { e.key === "Enter" ? commitEdit(t.id) : e.key === "Escape" && setEditingId(null); }}
                          autoFocus
                        />
                      ) : (
                        <p
                          className={`text-[11px] font-bold truncate leading-tight ${t.completed ? "line-through text-zinc-400" : "text-zinc-800"} ${readOnly ? "" : "hover:underline cursor-text"}`}
                               onClick={() => onEditTask(t)}

                        >
                          {t.title}
                        </p>
                      )}
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); startEdit(t); }} className="p-1 text-zinc-300 hover:text-zinc-600 transition-colors" title="Edit Item">
                          <Pen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (window.confirm("Are you sure you want to delete this parking lot item?")) deleteItem(t.id); }}
                          className="p-1 text-zinc-300 hover:text-rose-500 transition-colors mr-1"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}