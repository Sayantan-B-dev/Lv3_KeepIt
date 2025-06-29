import { useFlash } from "../context/FlashContext";

const typeToColor = {
  success: "bg-green-100 text-green-800 border-green-400",
  error: "bg-red-100 text-red-800 border-red-400",
  info: "bg-blue-100 text-blue-800 border-blue-400",
};

export default function FlashMessage() {
  const { flash, clearFlash } = useFlash();
  if (!flash.message) return null;
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow border ${typeToColor[flash.type] || typeToColor.info} z-50 flex items-center gap-2`}>
      <span>{flash.message}</span>
      <button onClick={clearFlash} className="ml-2 text-lg font-bold">&times;</button>
    </div>
  );
} 