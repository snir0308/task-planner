import { motion, AnimatePresence } from "framer-motion";
import { CirclePlus, Plus } from "lucide-react";
import TaskCard from "./TaskCard.jsx";
import { getQuadrantBorderColor } from "../config.js";

function quadrantNumber(id) {
  if (id === "urgent-important") return "01";
  if (id === "not-urgent-important") return "02";
  if (id === "urgent-not-important") return "03";
  return "04";
}

export default function Quadrant({
  info,
  tasks,
  onAddTask,
  onEditTask,
  onToggleStatus,
  onMoveTask,
  onDelete,
  readOnly,
  draggedTaskId,
  setDraggedTaskId,
  dragOverCardId,
  setDragOverCardId,
  dragOverPosition,
  setDragOverPosition,
  dragOverQuadrantId,
  setDragOverQuadrantId,
  onReorderTask,
  onDropQuadrant,
  setHoveredTaskId,
}) {
  return (
    <motion.div
      layout
      className={`flex flex-col h-full bg-white border-l-4 shadow-sm relative group/quad transition-all duration-200 ${readOnly ? "" : "hover:shadow-md"} ${dragOverQuadrantId === info.id ? "bg-zinc-50 border-zinc-300 ring-2 ring-zinc-200 z-10" : ""}`}
      style={{ borderLeftColor: getQuadrantBorderColor(info.id) }}
      onDragOver={(e) => {
        if (readOnly) return;
        e.preventDefault();
        if (!dragOverCardId) setDragOverQuadrantId(info.id);
      }}
      onDragLeave={() => { if (dragOverQuadrantId === info.id) setDragOverQuadrantId(null); }}
      onDrop={(e) => {
        if (readOnly) return;
        e.preventDefault();
        if (draggedTaskId && !dragOverCardId) onDropQuadrant(info.id);
        setDraggedTaskId(null);
        setDragOverCardId(null);
        setDragOverPosition(null);
        setDragOverQuadrantId(null);
      }}
    >
      <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="opacity-30">{quadrantNumber(info.id)}</span>
            <span className={info.textColor}>{info.title}</span>
          </h2>
          <p className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wide">{info.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {!readOnly && (
            <button onClick={onAddTask} className="p-1 hover:bg-zinc-100 rounded text-zinc-400 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {tasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-zinc-300 py-8 border border-dashed border-zinc-200"
            >
              <CirclePlus className="w-8 h-8 mb-2 stroke-1 opacity-20" />
              <p className="text-[9px] font-bold uppercase tracking-widest">{readOnly ? "No Tasks Formulated" : "+ Create Task"}</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onToggle={() => onToggleStatus(task.id)}
                onMove={(qid) => onMoveTask(task.id, qid)}
                onDelete={() => onDelete(task.id)}
                readOnly={readOnly}
                draggedTaskId={draggedTaskId}
                setDraggedTaskId={setDraggedTaskId}
                dragOverCardId={dragOverCardId}
                setDragOverCardId={setDragOverCardId}
                dragOverPosition={dragOverPosition}
                setDragOverPosition={setDragOverPosition}
                setDragOverQuadrantId={setDragOverQuadrantId}
                onReorderTask={onReorderTask}
                setHoveredTaskId={setHoveredTaskId}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}