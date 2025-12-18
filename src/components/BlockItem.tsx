"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/types";

interface BlockItemProps {
  block: Block;
  onDelete: (id: string) => void;
  onUpdate: (id: string, params: Record<string, any>) => void;
}

export default function BlockItem({
  block,
  onDelete,
  onUpdate,
}: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getBlockColor = () => {
    switch (block.type) {
      case "print":
        return "bg-sky-50 border-sky-300 text-sky-800";
      case "variable":
        return "bg-emerald-50 border-emerald-300 text-emerald-800";
      case "if":
        return "bg-amber-50 border-amber-300 text-amber-800";
      case "newline":
        return "bg-gray-50 border-gray-300 text-gray-800";
    }
  };

  const getBlockLabel = () => {
    switch (block.type) {
      case "print":
        return "print";
      case "variable":
        return "変数";
      case "if":
        return "if";
      case "newline":
        return "↵";
    }
  };

  const handleInputMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleInputPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-xl border-2 p-3 shadow-sm ${getBlockColor()}`}
    >
      {/* ドラッグハンドル（ラベル部分のみ） */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex items-center px-2 py-1 rounded-md hover:bg-black/5 transition-colors"
      >
        <span className="text-xs font-semibold md:text-sm select-none">
          {getBlockLabel()}
        </span>
      </div>

      {/* 入力フィールド（ドラッグハンドルから分離） */}
      <div className="flex flex-1 items-center gap-2">
        {block.type === "print" && (
          <input
            type="text"
            value={block.params.text || ""}
            onChange={(e) =>
              onUpdate(block.id, { ...block.params, text: e.target.value })
            }
            onMouseDown={handleInputMouseDown}
            onPointerDown={handleInputPointerDown}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Hello World"
          />
        )}
        {block.type === "variable" && (
          <>
            <input
              type="text"
              value={block.params.name || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.params, name: e.target.value })
              }
              onMouseDown={handleInputMouseDown}
              onPointerDown={handleInputPointerDown}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 rounded-md border border-emerald-200 bg-white px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="name"
            />
            <span className="text-xs md:text-sm">=</span>
            <input
              type="text"
              value={block.params.value || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.params, value: e.target.value })
              }
              onMouseDown={handleInputMouseDown}
              onPointerDown={handleInputPointerDown}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 rounded-md border border-emerald-200 bg-white px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Yuki"
            />
          </>
        )}
        {block.type === "if" && (
          <input
            type="text"
            value={block.params.condition || ""}
            onChange={(e) =>
              onUpdate(block.id, {
                ...block.params,
                condition: e.target.value,
              })
            }
            onMouseDown={handleInputMouseDown}
            onPointerDown={handleInputPointerDown}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-md border border-amber-200 bg-white px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="age >= 10"
          />
        )}
        {block.type === "newline" && (
          <div className="font-mono text-gray-600 text-sm">↵ 改行</div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(block.id);
        }}
        className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200 active:scale-95"
        title="削除"
      >
        ×
      </button>
    </div>
  );
}

