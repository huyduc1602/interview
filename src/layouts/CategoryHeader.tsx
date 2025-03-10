import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryHeaderProps {
  isExpanded: boolean;
  title: string;
  itemCount: number;
  onClick: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  isExpanded,
  title,
  itemCount,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      {isExpanded ?
        <ChevronDown className="h-4 w-4" /> :
        <ChevronRight className="h-4 w-4" />
      }
      <span>{title}</span>
      <Badge variant="secondary" className="text-xs">
        {itemCount}
      </Badge>
    </button>
  );
}