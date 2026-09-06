export const QUADRANTS = {
  URGENT_IMPORTANT: "urgent-important",
  NOT_URGENT_IMPORTANT: "not-urgent-important",
  URGENT_NOT_IMPORTANT: "urgent-not-important",
  NOT_URGENT_NOT_IMPORTANT: "not-urgent-not-important",
};

export const QUADRANT_CONFIG = [
  { id: QUADRANTS.URGENT_IMPORTANT, title: "Selectively Invest", subtitle: "High Value, High Effort", description: "Major capital projects or initiatives. Require collaboration and significant investment.", color: "bg-rose-500", textColor: "text-rose-700", bgColor: "bg-rose-50" },
  { id: QUADRANTS.NOT_URGENT_IMPORTANT, title: "Do First / Drive Daily", subtitle: "High Value, Low Effort", description: "Low-hanging fruit. High-impact tasks you can knock out quickly on your own.", color: "bg-indigo-500", textColor: "text-indigo-700", bgColor: "bg-indigo-50" },
  { id: QUADRANTS.NOT_URGENT_NOT_IMPORTANT, title: "Ignore / Delay", subtitle: "Low Value, High Effort", description: "Actively ignored or delayed until market timing changes or eventually retired.", color: "bg-zinc-400", textColor: "text-zinc-600", bgColor: "bg-zinc-50" },
  { id: QUADRANTS.URGENT_NOT_IMPORTANT, title: "Work In", subtitle: "Low Value, Low Effort", description: "Tasks to do when you have extra time or run low on High-Value objectives.", color: "bg-amber-500", textColor: "text-amber-700", bgColor: "bg-amber-50" },
];

export const getQuadrantBorderColor = (id) =>
  id === QUADRANTS.URGENT_IMPORTANT ? "#f43f5e"
  : id === QUADRANTS.NOT_URGENT_IMPORTANT ? "#6366f1"
  : id === QUADRANTS.URGENT_NOT_IMPORTANT ? "#f59e0b"
  : "#a1a1aa";

export const formatShortDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" }).replace("/", ".");