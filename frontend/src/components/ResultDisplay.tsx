import React from "react";
import type { RouletteItem } from "../types";

interface ResultDisplayProps {
  selectedItem: RouletteItem | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ selectedItem }) => {
  if (!selectedItem) return null;

  return (
    <div className="p-6 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-lg shadow-xl text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">🎉 당첨! 🎉</h2>
      <p className="text-3xl font-extrabold text-slate-800 py-4 px-6 bg-white/30 rounded-md break-all">
        {selectedItem.text}
      </p>
    </div>
  );
};

export default ResultDisplay;
