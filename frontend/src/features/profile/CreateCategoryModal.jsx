import React, { useState } from "react";
import SimpleModal from "@/components/ui/SimpleModal";
import { FolderPlus, Layers, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";

const CreateCategoryModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a name");
    if (name.trim().length < 3) return toast.error("Name must be at least 3 characters");

    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/categories", { name: name.trim() });
      toast.info(res.status === 200 ? "Synced with existing category!" : "Category created successfully!");

      onCreated(res.data);
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <SimpleModal open={open} onClose={handleClose} title="Create New Category">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-type-3 ml-1 uppercase tracking-widest">
            Category Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Project X"
            className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl px-4 py-3 text-type-1 font-mono outline-none transition-all placeholder:text-type-3/50"
          />
        </div>

        <p className="text-[10px] text-type-3 font-mono leading-relaxed bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
          Tip: If you enter a name that already exists, we'll automatically sync your account to that category.
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            disabled={loading}
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold font-mono py-3 rounded-2xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : (
              <>
                <Save className="w-4 h-4" /> CREATE & SYNC
              </>
            )}
          </button>
        </div>
      </form>
    </SimpleModal>
  );
};

export default CreateCategoryModal;
