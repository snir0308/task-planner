import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Pen, User, X } from "lucide-react";

export default function ProfileModal({ initialImageUrl, initialPurpose, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [purpose, setPurpose] = useState(initialPurpose);
  const [imageError, setImageError] = useState(false);

  const handleImageChange = (val) => { setImageUrl(val); setImageError(false); };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(imageUrl.trim(), purpose.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setImageUrl(initialImageUrl);
    setPurpose(initialPurpose);
    setImageError(false);
    setIsEditing(false);
  };

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
        className="relative bg-white w-full max-w-lg border border-zinc-900 shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 leading-none">
                {isEditing ? "Edit Profile & Purpose" : "Profile & Purpose"}
              </h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                {isEditing ? "Update your profile image URL and edit your purpose statement" : "Your personal profile and guiding purpose statement"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 bg-white transition-colors cursor-pointer"
                title="Enter edit mode"
              >
                <Pen className="w-3 h-3 text-zinc-400" />
                <span>Edit</span>
              </button>
            )}
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">Profile Picture</label>
                <div className="flex items-center gap-4 p-3.5 bg-zinc-50 border border-zinc-200">
                  <div className="relative w-16 h-16 rounded-full border-2 border-zinc-900 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {imageUrl.trim() && !imageError ? (
                      <img
                        src={imageUrl.trim()}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 text-zinc-200 flex items-center justify-center">
                        <User className="w-7 h-7 text-zinc-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-zinc-800 block mb-0.5">Live Avatar Preview</span>
                    <p className="text-[11px] text-zinc-500 leading-tight">
                      {imageError ? (
                        <span className="text-rose-600 font-medium">Unable to load image from URL. Please check the link.</span>
                      ) : imageUrl.trim() ? (
                        "Image loaded successfully and ready to display."
                      ) : (
                        "Provide an image URL below to display your custom photo."
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Image URL</span>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => handleImageChange("")}
                        className="text-[10px] text-zinc-400 hover:text-rose-600 font-medium transition-colors"
                      >
                        Clear image
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleImageChange(e.target.value)}
                      placeholder="https://example.com/your-photo.jpg"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-zinc-300 focus:border-zinc-900 focus:outline-none bg-white text-zinc-900 transition-colors placeholder:text-zinc-400 font-mono"
                    />
                    <Image className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">Purpose Statement</label>
                  <span className="text-[10px] text-zinc-400 font-mono">{purpose.length} characters</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Your guiding North Star or mission to keep you focused on what truly matters most each day.
                </p>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Focus on high-leverage initiatives, eliminate reactive distractions, and build long-term value."
                  rows={4}
                  className="w-full p-3 text-xs border border-zinc-300 focus:border-zinc-900 focus:outline-none bg-white text-zinc-900 leading-relaxed placeholder:text-zinc-400 resize-y transition-colors font-sans"
                />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between shrink-0">
              <button type="button" onClick={handleCancel} className="px-4 py-2 border border-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-1.5 px-5 py-2 bg-zinc-950 border border-zinc-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-xs">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-6 custom-scrollbar">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-zinc-900 bg-zinc-100 flex items-center justify-center overflow-hidden shadow-sm ring-4 ring-zinc-100/80 shrink-0">
                  {initialImageUrl && !imageError ? (
                    <img src={initialImageUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={() => setImageError(true)} />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 text-white flex items-center justify-center">
                      <User className="w-14 h-14 text-zinc-300" />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full max-w-md space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Purpose Statement</span>
                {initialPurpose ? (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xs">
                    <p className="text-sm md:text-base font-serif italic text-zinc-800 leading-relaxed">“{initialPurpose}”</p>
                  </div>
                ) : (
                  <div className="py-4 px-3 border border-dashed border-zinc-200 bg-zinc-50/50 text-zinc-400 text-xs italic">
                    No purpose statement set yet.
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between shrink-0">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors">
                Close
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 bg-white text-xs font-medium uppercase tracking-wider transition-colors shadow-2xs"
              >
                <Pen className="w-3.5 h-3.5 text-zinc-400" />Edit Profile
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}