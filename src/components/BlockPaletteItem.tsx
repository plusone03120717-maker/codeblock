"use client";

import { useDraggable } from "@dnd-kit/core";
import { Block } from "@/types";

interface BlockPaletteItemProps {
  type: "print" | "variable" | "if";
  label: string;
}

export default function BlockPaletteItem({
  type,
  label,
}: BlockPaletteItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `palette-${type}`,
      data: {
        type,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const getBlockColor = () => {
    switch (type) {
      case "print":
        return "bg-sky-50 border-sky-300 text-sky-800";
      case "variable":
        return "bg-emerald-50 border-emerald-300 text-emerald-800";
      case "if":
        return "bg-amber-50 border-amber-300 text-amber-800";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing rounded-xl border-2 px-3 py-2 text-xs font-semibold shadow-sm transition hover:shadow-md md:text-sm ${getBlockColor()} ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {label}
    </div>
  );
}


