import React from "react";
import type { RouletteItem } from "../types";

interface ItemListProps {
  items: RouletteItem[];
  onDeleteItem: (id: string) => void;
  isSpinning: boolean;
  // highlightedItemId?: string | null; // For visual animation later
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  onDeleteItem,
  isSpinning /*, highlightedItemId */,
}) => {
  if (items.length === 0) {
    return (
      <p className="text-center text-slate-400 py-4">
        아직 추가된 항목이 없습니다. 내용을 입력해주세요!
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item /*, index */) => (
        <li
          key={item.id}
          className={`
            flex justify-between items-center p-3 bg-slate-600 rounded-md group transition-all duration-150 ease-in-out
            ${
              /* highlightedItemId === item.id ? 'ring-2 ring-yellow-400 scale-105 shadow-lg' : */ ""
            }
          `}
        >
          <span className="text-slate-50 break-all">{item.text}</span>
          <button
            onClick={() => onDeleteItem(item.id)}
            disabled={isSpinning}
            className="ml-2 px-2 py-1 text-xs text-pink-400 hover:text-pink-300 opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
            title="삭제"
            aria-label={`Delete item ${item.text}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ItemList;
