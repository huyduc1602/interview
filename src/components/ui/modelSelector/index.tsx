import React from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { AIModel } from "@/services/aiServices/types";
import { ModelGroup, modelGroups } from "./models";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: AIModel) => void;
  onRegenerate?: () => void;
  onClearCache?: () => void;
  loading?: boolean;
  disabled?: boolean;
  type: 'chat' | 'interview' | 'knowledge';
  groups?: ModelGroup[]; // Optional prop to override default model groups
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel = AIModel.GPT35_0125,
  onModelChange,
  groups = modelGroups,
  ...props
}) => {
  const { t } = useTranslation();

  const handleModelChange = (value: string) => {
    onModelChange(value as AIModel);
  };

  return (
    <div className="flex items-center gap-2 mb-4 mt-2 px-1">
      <Select
        value={selectedModel}
        onValueChange={handleModelChange}
        disabled={props.loading}
      >
        <SelectTrigger className="w-[200px] bg-white dark:bg-gray-950">
          <SelectValue placeholder={t(`${props.type}.models.select`)} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-950">
          {groups.map((group, groupIndex) => (
            <SelectGroup key={`group-${groupIndex}`}>
              <SelectLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                {t(group.label)}
              </SelectLabel>
              {group.models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    {model.icon}
                    <span>{t(model.name)}</span>
                    {model.badge && (
                      <span className={`ml-auto text-xs ${model.badge.color}`}>
                        {t(model.badge.text)}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={props.onRegenerate}
        disabled={props.disabled || props.loading}
        className="h-10 w-10 px-3 py-2"
        title={t(`${props.type}.actions.regenerate`)}
      >
        <RefreshCw className={cn("h-4 w-4", props.loading && "animate-spin")} />
      </Button>
    </div>
  );
};