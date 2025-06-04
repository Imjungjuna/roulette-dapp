import React, { useState } from "react";

interface ItemInputProps {
  onAddItem: (text: string) => void;
  disabled?: boolean;
}

const ItemInput: React.FC<ItemInputProps> = ({ onAddItem, disabled }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onAddItem(inputValue.trim());
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="룰렛에 추가할 내용 입력..."
        disabled={disabled}
        className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow text-slate-100 placeholder-slate-400 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className="px-6 py-3 font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        항목 추가
      </button>
    </form>
  );
};

export default ItemInput;
