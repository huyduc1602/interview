import { Zap, Sparkles, Bot, Stars } from "lucide-react";
import { AIModel } from "@/services/aiServices/types";

export interface ModelOption {
    id: AIModel;
    name: string; // This will now be a translation key
    icon: React.ReactNode;
    badge?: {
        text: string; // This will now be a translation key
        color: string;
    };
}

export interface ModelGroup {
    label: string; // This will now be a translation key
    models: ModelOption[];
}

const isDevelopment = process.env.NODE_ENV === 'development';

export const modelGroups: ModelGroup[] = [
    {
        label: "models.groups.openai",
        models: [
            {
                id: AIModel.GPT35_0125,
                name: "models.openai.gpt35",
                icon: <Zap className="w-4 h-4 text-blue-500" />
            },
            {
                id: AIModel.GPT4,
                name: "models.openai.gpt4",
                icon: <Zap className="w-4 h-4 text-blue-500" />,
                badge: {
                    text: "models.badges.premium",
                    color: "text-muted-foreground"
                }
            },
        ]
    },
    {
        label: "models.groups.free",
        models: [
            ...(isDevelopment ? [{
                id: AIModel.GEMINI,
                name: "models.google.gemini",
                icon: <Sparkles className="w-4 h-4 text-green-500" />,
                badge: {
                    text: "models.badges.google",
                    color: "text-green-500"
                }
            }] : []),
            {
                id: AIModel.MISTRAL,
                name: "models.mistral.small",
                icon: <Bot className="w-4 h-4 text-purple-500" />,
                badge: {
                    text: "models.badges.mistral",
                    color: "text-purple-500"
                }
            },
            {
                id: AIModel.OPENCHAT,
                name: "models.openchat.35",
                icon: <Stars className="w-4 h-4 text-orange-500" />,
                badge: {
                    text: "models.badges.free",
                    color: "text-orange-500"
                }
            },
        ]
    }
];