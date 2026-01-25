import React from "react";
import { useNavigate } from "react-router-dom";
import SimpleModal from "@/components/ui/SimpleModal";
import { FolderHeart, ChevronRight } from "lucide-react";

const CategoryStatsModal = ({ open, onClose, categories }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (catId) => {
        onClose();
        navigate(`/category/${catId}`);
    };

    return (
        <SimpleModal open={open} onClose={onClose} title="Categories">
            {categories.length === 0 ? (
                <div className="text-center text-type-3 font-mono p-8 italic">
                    No categories found.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {categories.map((cat) => (
                        <div
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat._id)}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                    <FolderHeart className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-type-1 font-bold font-mono">
                                        {cat.name}
                                    </span>
                                    <span className="text-[10px] text-type-3 uppercase tracking-widest font-bold">
                                        {cat.categoryType?.name || "General"}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-type-3 group-hover:text-type-1 transition-all group-hover:translate-x-1" />
                        </div>
                    ))}
                </div>
            )}
        </SimpleModal>
    );
};

export default CategoryStatsModal;
