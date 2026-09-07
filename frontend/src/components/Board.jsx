import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Camera, Download, FileText, Sparkles, User, Star } from "lucide-react";
import Quadrant from "./Quadrant.jsx";
import Sidebar from "./Sidebar.jsx";
import TaskModal from "./TaskModal.jsx";
import CleanupModal from "./CleanupModal.jsx";
import ProfileModal from "./ProfileModal.jsx";
import FavoritesModal from "./FavoritesModal.jsx";
import { QUADRANT_CONFIG } from "../config.js";
import { useBoardService } from "../context/BoardServiceContext.jsx";

export default function Board({ readOnly = false }) {
  const boardService = useBoardService();

  const [tasks, setTasks] = useState([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [cleanupOpen, setCleanupOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
   const [profileImage, setProfileImage] = useState("");
   const [displayName, setDisplayName] = useState("");
   const [purposeStatement, setPurposeStatement] = useState("");
   const [lastBackup, setLastBackup] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

   // Load initial data
   useEffect(() => {
     const loadData = async () => {
       const [loadedTasks, loadedProfile, loadedDisplayName, loadedPurpose, loadedBackup] = await Promise.all([
         boardService.getTasks(),
         boardService.getProfileImage(),
         boardService.getDisplayName(),
         boardService.getPurposeStatement(),
         boardService.getLastBackup(),
       ]);
       setTasks(loadedTasks);
       setProfileImage(loadedProfile);
       setDisplayName(loadedDisplayName);
       setPurposeStatement(loadedPurpose);
       setLastBackup(loadedBackup);
       setIsLoaded(true);
     };
     loadData();
   }, [boardService]);

  // Save tasks when they change
  useEffect(() => {
    if (isLoaded && !readOnly) {
      boardService.setTasks(tasks);
    }
  }, [tasks, boardService, isLoaded, readOnly]);

  const boardTasks = useMemo(() => tasks.filter((t) => !t.isSimple && !t.parkingLot), [tasks]);

  const doneSubtaskCount = useMemo(
    () => tasks.reduce((sum, t) => sum + (t.subtasks || []).filter((st) => st.completed).length, 0),
    [tasks]
  );

  const removeAllCompletedSubtasks = () => {
    setTasks((t) => t.map((x) => ({ ...x, subtasks: (x.subtasks || []).filter((st) => !st.completed) })));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks((t) => t.map((x) => (x.id !== taskId ? x : { ...x, subtasks: (x.subtasks || []).filter((st) => st.id !== subtaskId) })));
  };

  const clearParentCompleted = (taskId) => {
    setTasks((t) => t.map((x) => (x.id !== taskId ? x : { ...x, subtasks: (x.subtasks || []).filter((st) => !st.completed) })));
  };

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverCardId, setDragOverCardId] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const [dragOverQuadrantId, setDragOverQuadrantId] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  const backupInfo = useMemo(() => {
    if (!lastBackup) return { isOverdue: true, text: "No backup found. Please download a backup to secure your tasks!" };
    const date = new Date(lastBackup);
    if (isNaN(date.getTime())) return { isOverdue: true, text: "No backup found. Please download a backup to secure your tasks!" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const backupDay = new Date(date);
    backupDay.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - backupDay.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 7) {
      return { isOverdue: true, text: `Last backup was ${diffDays} days ago (${date.toLocaleDateString()}). Please download a backup.` };
    }
    const agoText = diffDays === 0 ? "today" : diffDays === 1 ? "yesterday" : `${diffDays} days ago`;
    return { isOverdue: false, text: `Last backup was ${agoText} (${date.toLocaleDateString()}).` };
  }, [lastBackup]);

  const createTask = (quadrantId) => {
    const newTask = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      quadrantId,
      subtasks: [],
      createdAt: Date.now(),
      completed: false,
      supportNeeded: false,
    };
    setEditingTask(newTask);
    setTaskModalOpen(true);
  };

  const saveTask = (task) => {
    setTasks((t) => (t.find((x) => x.id === task.id) ? t.map((x) => (x.id === task.id ? task : x)) : [...t, task]));
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks((t) => t.filter((x) => x.id !== id));
    if (editingTask?.id === id) {
      setTaskModalOpen(false);
      setEditingTask(null);
    }
  };

  const toggleTaskStatus = (id) => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));
  };

  const moveTask = (id, quadrantId) => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, quadrantId } : x)));
  };

  const reorderTask = (sourceId, targetId, position) => {
    setTasks((t) => {
      const source = t.find((x) => x.id === sourceId);
      const target = t.find((x) => x.id === targetId);
      if (!source || !target) return t;
      const moved = { ...source, quadrantId: target.quadrantId };
      const withoutSource = t.filter((x) => x.id !== sourceId);
      const targetIndex = withoutSource.findIndex((x) => x.id === targetId);
      if (targetIndex === -1) return [...withoutSource, moved];
      const insertAt = position === "top" ? targetIndex : targetIndex + 1;
      const next = [...withoutSource];
      next.splice(insertAt, 0, moved);
      return next;
    });
  };

  const dropOnQuadrant = (quadrantId) => {
    if (!draggedTaskId) return;
    setTasks((t) => {
      const task = t.find((x) => x.id === draggedTaskId);
      if (!task) return t;
      const moved = { ...task, quadrantId };
      return [...t.filter((x) => x.id !== draggedTaskId), moved];
    });
  };

  const downloadBackup = async () => {
    const data = JSON.stringify(tasks, null, 2);
    const href = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    const link = document.createElement("a");
    link.setAttribute("href", href);
    link.setAttribute("download", "matrix-tasks-raw.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
    const now = new Date().toISOString();
    await boardService.setLastBackup(now);
    setLastBackup(now);
  };

  const exportTasks = () => {
    let content = "";
    const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    content += `2x2 TASK PLANNER EXPORT - ${dateStr}\n`;
    content += `==========================================\n\n`;
    QUADRANT_CONFIG.forEach((quadrant) => {
      const qTasks = tasks.filter((t) => !t.isSimple && !t.parkingLot && t.quadrantId === quadrant.id);
      content += `${quadrant.title.toUpperCase()} (${quadrant.subtitle})\n`;
      content += `${"-".repeat(quadrant.title.length + 3 + quadrant.subtitle.length)}\n`;
      if (qTasks.length === 0) {
        content += `  (No tasks)\n`;
      } else {
        qTasks.forEach((t) => {
          const status = t.completed ? "[x]" : "[ ]";
          const due = t.dueDate ? ` (Due: ${t.dueDate})` : "";
          content += `  ${status} ${t.title}${due}\n`;
          if (t.description) content += `      Description: ${t.description}\n`;
          if (t.notes) content += `      Notes: ${t.notes}\n`;
          if (t.subtasks && t.subtasks.length > 0) {
            t.subtasks.forEach((st) => {
              const stStatus = st.completed ? "[x]" : "[ ]";
              const stDue = st.dueDate ? ` (Due: ${st.dueDate})` : "";
              content += `    ${stStatus} ${st.title}${stDue}\n`;
            });
          }
        });
      }
      content += `\n`;
    });

    const support = tasks.filter((t) => t.supportNeeded);
    content += `SUPPORT NEEDED\n`;
    content += `==============\n`;
    if (support.length === 0) {
      content += `  (No support needed items)\n`;
    } else {
      support.forEach((t) => {
        const status = t.completed ? "[x]" : "[ ]";
        content += `  ${status} ${t.title}\n`;
      });
    }
    content += `\n`;

    const parking = tasks.filter((t) => t.parkingLot);
    content += `PARKING LOT\n`;
    content += `===========\n`;
    if (parking.length === 0) {
      content += `  (No parking lot items)\n`;
    } else {
      parking.forEach((t) => {
        const status = t.completed ? "[x]" : "[ ]";
        content += `  ${status} ${t.title}\n`;
      });
    }
    content += `\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `2x2-tasks-export-${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const saveProfile = async (displayName, imageUrl, purpose) => {
    await boardService.setDisplayName(displayName);
    await boardService.setProfileImage(imageUrl);
    await boardService.setPurposeStatement(purpose);
    setDisplayName(displayName);
    setProfileImage(imageUrl);
    setPurposeStatement(purpose);
  };

  return (
    <div className="h-[calc(100vh-16px)] max-h-[calc(100vh-16px)] bg-zinc-50 text-zinc-900 font-sans flex flex-col overflow-hidden">
      <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-zinc-200 shrink-0">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setProfileOpen(true)}
            className={`relative group w-10 h-10 rounded-full border border-zinc-300 bg-zinc-100 flex items-center justify-center overflow-hidden transition-all shadow-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-1 ${readOnly ? "cursor-default" : "hover:border-zinc-950 cursor-pointer"}`}
            title={readOnly ? "Click to view Profile" : "Click to view & edit Profile Photo and Purpose Statement"}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 text-white flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-200" />
              </div >
            )}
            {!readOnly && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-4 h-4" />
              </div >
            )}
          </button>
          <div onClick={() => setProfileOpen(true)} className="cursor-pointer group/title">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 leading-none group-hover/title:text-zinc-700 transition-colors">2x2</h1>
              {displayName && (
                <span className="text-sm font-medium text-zinc-500 ml-2">| {displayName}</span >
              )}
            </div >
            <p className="text-[10px] font-sans text-zinc-400 uppercase tracking-widest mt-0.5 font-semibold">task planner</p>
          </div >
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Task Overview</span
            >
            <span className="text-xs font-sans text-zinc-600 font-bold tracking-tight">{tasks.length} active tasks</span
            >
          </div >
          {!readOnly && (
            <>
              <button
                onClick={() => setFavoritesOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border text-[10px] bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all"
                title="Open Favorites"
              >
                <Star className="w-3.5 h-3.5" />
                Favorites
              </button>
              <button
                onClick={downloadBackup}
                className={`flex items-center gap-2 px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all ${backupInfo.isOverdue ? "bg-rose-50 border-rose-300 text-rose-600 hover:border-rose-600 hover:text-rose-700 hover:bg-rose-100/50" : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"}`}
                title={backupInfo.text}
              >
                <Download className={`w-3.5 h-3.5 ${backupInfo.isOverdue ? "text-rose-500" : ""}`} />
                Download Backup
              </button>
              <button
                onClick={() => setCleanupOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
                title="Clean up completed subtasks to optimize storage"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                Clean Up
                {doneSubtaskCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-rose-100 text-rose-700 rounded-full font-sans font-bold leading-none">
                    {doneSubtaskCount}
                  </span
                  >
                )}
              </button>
              <button
                onClick={exportTasks}
                className="flex items-center gap-2 px-4 py-2 border text-[10px] bg-black border-black text-white font-bold uppercase tracking-widest transition-all hover:bg-zinc-800 hover:border-zinc-800"
                title="Export Tasks to Indented Text File"
              >
                <FileText className="w-3.5 h-3.5" />
                Export
              </button>
            </>
          )}
        </div >
      </header>

      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 grid-rows-none lg:grid-rows-2 gap-4 overflow-y-auto lg:overflow-hidden custom-scrollbar">
          {QUADRANT_CONFIG.map((quadrant) => (
            <Quadrant
              key={quadrant.id}
              info={quadrant}
              tasks={boardTasks.filter((t) => t.quadrantId === quadrant.id)}
               onAddTask={readOnly ? undefined : () => createTask(quadrant.id)}
               onEditTask={(task) => { setEditingTask(task); setTaskModalOpen(true); }}
               onToggleStatus={toggleTaskStatus}
  
               onMoveTask={moveTask}
               onDelete={deleteTask}
               readOnly={readOnly}
               draggedTaskId={draggedTaskId}
               setDraggedTaskId={setDraggedTaskId}
               dragOverCardId={dragOverCardId}
               setDragOverCardId={setDragOverCardId}
               dragOverPosition={dragOverPosition}
               setDragOverPosition={setDragOverPosition}
               dragOverQuadrantId={dragOverQuadrantId}
               setDragOverQuadrantId={setDragOverQuadrantId}
               onReorderTask={reorderTask}
               onDropQuadrant={dropOnQuadrant}
               setHoveredTaskId={setHoveredTaskId}
            />
          ))}
        </div
        >
        <Sidebar tasks={tasks} onEditTask={readOnly ? undefined : (task) => { setEditingTask(task); setTaskModalOpen(true); }} setTasks={readOnly ? undefined : setTasks} readOnly={readOnly} hoveredTaskId={hoveredTaskId} />
      </main>

       <AnimatePresence>
         {taskModalOpen && editingTask && (
           <TaskModal 
             task={editingTask} 
             onClose={() => { setTaskModalOpen(false); setEditingTask(null); }} 
             onSave={readOnly ? undefined : saveTask} 
             onDelete={readOnly ? undefined : deleteTask} 
             readOnly={readOnly}
           />
         )}
         {!readOnly && cleanupOpen && (
           <CleanupModal
             tasks={tasks}
             onClose={() => { setCleanupOpen(false); }}
             onDeleteAll={removeAllCompletedSubtasks}
             onDeleteSubtask={deleteSubtask}
             onDeleteParentDoneSubtasks={clearParentCompleted}
           />
         )}
         {profileOpen && (
           <ProfileModal 
             initialImageUrl={profileImage} 
             initialDisplayName={displayName} 
             initialPurpose={purposeStatement} 
             onClose={() => setProfileOpen(false)} 
             onSave={saveProfile} 
             readOnly={readOnly}
           />
         )}
         {!readOnly && favoritesOpen && (
           <FavoritesModal 
             isOpen={favoritesOpen} 
             onClose={() => setFavoritesOpen(false)} 
           />
         )}
       </AnimatePresence>

     </div >
   );
}
