import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, CircleCheck, Trash2 } from "lucide-react";
import { QUADRANT_CONFIG, formatShortDate } from "../config.js";

export default function TaskCard({
  task,
  onEdit,
  onToggle,
  onMove,
  onDelete,
  readOnly,
  draggedTaskId,
  setDraggedTaskId,
  dragOverCardId,
  setDragOverCardId,
  dragOverPosition,
  setDragOverPosition,
  setDragOverQuadrantId,
  onReorderTask,
  setHoveredTaskId,
}) {
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const isDragged = draggedTaskId === task.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={readOnly ? {} : { y: -0.5, backgroundColor: "#fff" }}
      onMouseEnter={() => { if (!readOnly) setHoveredTaskId(task.id); }}
      onMouseLeave={() => { if (!readOnly) setHoveredTaskId(null); }}
      draggable={!readOnly}
      onDragStart={(e) => {
        if (readOnly) return;
        setDraggedTaskId(task.id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
      }}
      onDragEnd={() => { setDraggedTaskId(null); setDragOverCardId(null); setDragOverPosition(null); setDragOverQuadrantId(null); }}
      onDragOver={(e) => {
        if (readOnly || draggedTaskId === task.id) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = e.clientY - rect.top < rect.height / 2 ? "top" : "bottom";
        setDragOverCardId(task.id);
        setDragOverPosition(pos);
        setDragOverQuadrantId(null);
      }}
      onDragLeave={() => { if (dragOverCardId === task.id) { setDragOverCardId(null); setDragOverPosition(null); } }}
      onDrop={(e) => {
        if (readOnly || draggedTaskId === task.id) return;
        e.preventDefault();
        e.stopPropagation();
        if (draggedTaskId && dragOverCardId) onReorderTask(draggedTaskId, task.id, dragOverPosition);
        setDraggedTaskId(null);
        setDragOverCardId(null);
        setDragOverPosition(null);
        setDragOverQuadrantId(null);
      }}
      className={`group bg-zinc-50 py-1.5 px-3 border border-zinc-200 transition-all relative flex items-center gap-3 ${task.completed ? "opacity-40 grayscale-100" : ""} ${readOnly ? "cursor-default" : "cursor-pointer"} ${isDragged ? "opacity-25 grayscale" : ""}`}
       onClick={(e) => { if (!e.target.closest(".stop-propagation")) onEdit(); }}
    >
      {dragOverCardId === task.id && dragOverPosition === "top" && <div className="absolute top-0 left-0 right-0 h-[3px] bg-zinc-800 z-50 pointer-events-none" />}
      {dragOverCardId === task.id && dragOverPosition === "bottom" && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-800 z-50 pointer-events-none" />}
      <button
        disabled={readOnly}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`flex-shrink-0 text-zinc-300 transition-colors ${readOnly ? "" : "hover:text-zinc-900"}`}
      >
        {task.completed ? <CircleCheck className="w-3.5 h-3.5 text-zinc-900" /> : <div className="w-3.5 h-3.5 border border-zinc-300" />}
      </button>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
        <h3 className={`text-xs font-bold text-zinc-800 truncate ${task.completed ? "line-through" : ""}`}>
          {task.title || "Untitled Task"}
        </h3>
        <div className="flex items-center gap-3 shrink-0">
          {(task.description || task.notes || task.subtasks.length > 0) && (
            <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
              {task.description && <div className="w-1 h-1 bg-zinc-400 rounded-full" title="Has description" />}
              {task.notes && <div className="w-1 h-1 bg-indigo-400 rounded-full" title="Has notes" />}
              {task.subtasks.length > 0 && <span className="text-[8px] font-mono text-zinc-400">[{task.subtasks.length}]</span>}
            </div>
          )}
          {task.dueDate && <span className="text-[9px] font-mono text-zinc-400 font-bold tracking-tight">{formatShortDate(task.dueDate)}</span>}
        </div>
      </div>
      {!readOnly && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity stop-propagation shrink-0">
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMoveMenuOpen(!moveMenuOpen); }}
              className="p-1 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {moveMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-zinc-900 rounded-none shadow-xl z-50 py-1 w-40"
                >
                  <p className="px-2 py-1 text-[8px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-50">Move to</p>
                  {QUADRANT_CONFIG.map((q) => (
                    <button
                      key={q.id}
                      disabled={q.id === task.quadrantId}
                      onClick={(e) => { e.stopPropagation(); onMove(q.id); setMoveMenuOpen(false); }}
                      className={`w-full text-left px-2 py-1 text-[9px] font-bold uppercase hover:bg-zinc-900 hover:text-white flex items-center gap-2 transition-colors ${q.id === task.quadrantId ? "opacity-20 cursor-not-allowed" : "text-zinc-700"}`}
                    >
                      {q.title}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 hover:bg-rose-50 text-zinc-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}