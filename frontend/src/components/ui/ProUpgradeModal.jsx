import React from "react";
import SimpleModal from "./SimpleModal";
import { Crown, Zap, Download, Tags, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProUpgradeModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      title: "Increased Rate Limit",
      desc: "Upload up to 2,000 notes per hour (vs 50 for normal users)."
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      title: "Faster Uploads",
      desc: "Reduced delay (3s) and 5x concurrent uploads."
    },
    {
      icon: <Download className="w-5 h-5 text-green-400" />,
      title: "ZIP Exports",
      desc: "Download entire categories as a single ZIP archive."
    },
    {
      icon: <Tags className="w-5 h-5 text-purple-400" />,
      title: "Bulk Tagging",
      desc: "Manage thousands of notes at once with bulk actions."
    }
  ];

  return (
    <SimpleModal open={open} onClose={onClose} title="Unlock Pro Features">
      <div className="flex flex-col gap-6 text-type-1 p-2">
        <div className="flex justify-center mb-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="p-4 bg-gradient-to-tr from-yellow-500/20 to-amber-500/10 rounded-full border border-yellow-500/30"
          >
            <Crown className="w-12 h-12 text-yellow-500" />
          </motion.div>
        </div>

        <p className="text-center text-type-2 font-mono text-sm">
          You have reached the limits of a standard account. Upgrade to Pro to unlock advanced productivity tools.
        </p>

        <div className="grid grid-cols-1 gap-4 mt-2">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="mt-1">{f.icon}</div>
              <div>
                <h4 className="text-sm font-bold font-mono text-type-1">{f.title}</h4>
                <p className="text-xs text-type-3 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              navigate("/upgrade");
            }}
            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold font-mono rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-95"
          >
            UPGRADE NOW
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2 text-type-3 hover:text-type-1 text-xs font-mono transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default ProUpgradeModal;
