import React from "react";
import type { RouletteItem } from "../types";

interface ResultDisplayProps {
  selectedItem: RouletteItem | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ selectedItem }) => {
  if (!selectedItem) return null;

  return (
    <div className="p-3 bg-gradient-to-r from-amber-700 to-yellow-300 rounded-lg shadow-xl text-center">
      <h2 className="text-lg md:text-xl font-medium text-slate-900 mb-2">
        🎉 당첨! 🎉
      </h2>
      <p className="text-xl md:text-2xl font-semibold text-slate-800 py-4 px-3 bg-white/30 rounded-md break-keep">
        {selectedItem.text}
      </p>
    </div>
  );
};

export default ResultDisplay;
