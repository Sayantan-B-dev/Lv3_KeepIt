import React from "react";
import RotatingText from "./advance/RotatingText";

const RotatingKeepIt = () => {
    return (
        <div className="h-[10%] flex justify-center items-center bg-transparent py-4 mb-10">
            <div className="flex items-center gap-3 px-6 py-2 bg-white/80 rounded-2xl shadow-lg border border-cyan-200">
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-700 drop-shadow-sm tracking-tight">
                    Keep
                </span>
                <RotatingText
                    texts={['It', 'Notes', 'Links', 'Ideas', 'Tasks', 'Reminders', 'Snippets', 'Thoughts']}
                    mainClassName="px-3 items-center sm:px-4 md:px-6 bg-gradient-to-r from-cyan-300 to-blue-200 text-cyan-900 font-bold text-xl sm:text-2xl md:text-3xl overflow-hidden py-1 sm:py-2 md:py-3 justify-center rounded-xl shadow"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                />
            </div>
        </div>
    );
};

export default RotatingKeepIt;