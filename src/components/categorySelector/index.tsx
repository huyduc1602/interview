import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { ChevronUp, Tag, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
    selectedCategories: string[];
    isTagsExpanded: boolean;
    setIsTagsExpanded: (expanded: boolean) => void;
    handleCategorySelect: (category: string) => void;
    knowledge: { category: string }[];
}

export default function CategorySelector({
    selectedCategories,
    isTagsExpanded,
    setIsTagsExpanded,
    handleCategorySelect,
    knowledge
}: CategorySelectorProps) {
    const { t } = useTranslation();
    const selectedCount = selectedCategories.length;
    const totalCount = knowledge?.length;

    if (!isTagsExpanded) {
        return (
            <div className="flex items-center gap-2">
                {selectedCategories.slice(0, 2).map((category, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200"
                        onClick={() => handleCategorySelect(category)}
                    >
                        {category} ×
                    </Badge>
                ))}
                {selectedCount > 2 && (
                    <Badge variant="outline">
                        +{selectedCount - 2} {t('interviewQuestions.categories.more')}
                    </Badge>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => setIsTagsExpanded(true)}
                >
                    <Tag className="h-4 w-4 mr-2" />
                    {t('interviewQuestions.categories.selectCount', { selected: selectedCount, total: totalCount })}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                    {t('interviewQuestions.categories.select')} ({selectedCount}/{totalCount})
                </span>
                <Tooltip content={t('interviewQuestions.tooltips.collapse')}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTagsExpanded(false)}
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                </Tooltip>
            </div>
            <div className="flex flex-wrap gap-2">
                {knowledge.map((category, index) => (
                    <Badge
                        key={index}
                        variant={selectedCategories.includes(category.category) ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer transition-colors",
                            selectedCategories.includes(category.category)
                                ? "hover:bg-primary/80"
                                : "hover:bg-gray-100"
                        )}
                        onClick={() => handleCategorySelect(category.category)}
                    >
                        {category.category}
                        {selectedCategories.includes(category.category) && (
                            <X className="h-3 w-3 ml-1 inline-block" />
                        )}
                    </Badge>
                ))}
            </div>
        </div>
    );
}