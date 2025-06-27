import React from "react";
import type { RouletteItem } from "../types";

interface ItemListProps {
  items: RouletteItem[];
  onDeleteItem: (
    id: string
  ) => void;
  isSpinning: boolean;
  highlightedItemId?:
    | string
    | null;
}

const ItemList: React.FC<
  ItemListProps
> = ({
  items,
  onDeleteItem,
  isSpinning,
  highlightedItemId,
}) => {
  return (
    <ul className="space-y-2">
      {/* 아니 부모 컨테이너 width 넘는 거 스크롤바 안보이게 하는 게 이렇게 어려울 일이야? */}
      {items.map(
        (
          item /*, index */
        ) => (
          <li
            key={item.id}
            className={`
            flex justify-between items-center p-[15.5px] bg-[#F6F6F6] h-[55px] rounded-[14.5px] group transition-all duration-50
            ${
              highlightedItemId ===
              item.id
                ? "bg-gray-300 shadow-lg font-bold"
                : ""
            }
          `}
          >
            <span className="text-black text-base break-keep tracking-tight">
              {item.text}
            </span>
            <button
              onClick={() =>
                onDeleteItem(
                  item.id
                )
              }
              disabled={
                isSpinning
              }
              className={`ml-2 px-2 py-1 text-xs ${
                isSpinning
                  ? "hidden"
                  : "block"
              } text-black opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed`}
              title="삭제"
              aria-label={`Delete item ${item.text}`}
            >
              ✕
            </button>
          </li>
        )
      )}
    </ul>
  );
};

export default ItemList;
