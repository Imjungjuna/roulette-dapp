import React, { useState } from "react";
import { Send } from "lucide-react";

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
    <form
      onSubmit={handleSubmit}
      className="flex justify-between rounded-full border border-black/60 h-12"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="룰렛에 추가할 내용 입력..."
        disabled={disabled}
        className="px-5 h-full -translate-y-0.5 text-base text-black disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className="my-auto mr-3 size-9 flex items-center justify-center bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={20} color="black" className="translate-y-0.3" />
      </button>
    </form>
  );
};

export default ItemInput;
