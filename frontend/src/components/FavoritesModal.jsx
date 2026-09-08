import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, X, Plus, ExternalLink, Trash2, Pencil, Check, Ban } from "lucide-react";
import { useBoardService } from "../context/BoardServiceContext.jsx";

export default function FavoritesModal({ isOpen, onClose }) {
  const boardService = useBoardService();
  const [favorites, setFavorites] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState("");
  const [editText, setEditText] = useState("");

  const loadFavorites = useCallback(async () => {
    const favs = await boardService.getFavorites();
    setFavorites(favs);
  }, [boardService]);

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen, loadFavorites]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newUrl.trim() || !newText.trim()) return;
    
    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    await boardService.addFavorite({
      url: formattedUrl,
      text: newText.trim()
    });
    
    setNewUrl("");
    setNewText("");
    await loadFavorites();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this favorite?")) return;
    await boardService.deleteFavorite(id);
    await loadFavorites();
  };

  const handleEditSubmit = async (id) => {
    if (!editUrl.trim() || !editText.trim()) return;
    
    let formattedUrl = editUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    await boardService.editFavorite(id, {
      url: formattedUrl,
      text: editText.trim()
    });

    setEditingId(null);
    setEditUrl("");
    setEditText("");
    await loadFavorites();
  };

  const startEditing = (fav) => {
    setEditingId(fav.id);
    setEditUrl(fav.url);
    setEditText(fav.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditUrl("");
    setEditText("");
  };

  const handleTileClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

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
        className="relative bg-white w-full max-w-md border border-zinc-900 shadow-2xl flex flex-col max-h-[85vh] rounded-none"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Favorites</span >
          </div >
          <button onClick={onClose} className="p-1 hover:bg-zinc-200 rounded transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div >

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-8">
            {/* Add Section */}
            <section className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Add New Favorite</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="URL (e.g. google.com)"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-2.5 text-xs focus:border-zinc-900 outline-none transition-all"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Visible Text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-4 py-2.5 text-xs focus:border-zinc-900 outline-none transition-all"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                  />
                  <button
                    onClick={handleAdd}
                    className="w-full py-2.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Favorite
                  </button>
                </div>
              </div>
            </section>

            {/* Favorites List */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">My Favorites</label>
                <span className="text-[9px] font-sans text-zinc-400">{favorites.length} items</span >
              </div >
              
              {favorites.length === 0 ? (
                <div className="py-8 text-center text-zinc-400 text-xs font-sans italic border border-dashed border-zinc-200">
                  No favorites added yet.
                </div >
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {favorites.map((fav) => (
                    editingId === fav.id ? (
                      <div
                        key={fav.id}
                        className="flex flex-col gap-2 p-3 border border-zinc-900 bg-white"
                      >
                        <input
                          type="text"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3 py-1.5 text-xs outline-none focus:border-zinc-900"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="URL"
                        />
                        <input
                          type="text"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3 py-1.5 text-xs outline-none focus:border-zinc-900"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          placeholder="Text"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditSubmit(fav.id)}
                            className="p-1.5 text-zinc-400 hover:text-emerald-500 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={fav.id}
                        className="group relative flex items-center justify-between p-3 border border-zinc-200 bg-white hover:border-zinc-900 transition-all cursor-pointer"
                        onClick={() => handleTileClick(fav.url)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <ExternalLink className="w-3..5 text-zinc-400 shrink-0" />
                          <span className="text-xs font-bold text-zinc-700 truncate">{fav.text}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(fav);
                            }}
                            className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(fav.id);
                            }}
                            className="p-1 text-zinc-400 hover:text-rose-500 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  ))}

                </div >
              )}
            </section>
          </div >
        </div >
      </motion.div>
    </div >
  );
}
