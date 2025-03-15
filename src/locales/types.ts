export interface Translations {
    home: {
        hero: {
            title: string;
            subtitle: string;
        };
        chat: {
            welcome: string;
            startPrompt: string;
            inputPlaceholder: string;
        };
        features: {
            knowledgeBase: {
                title: string;
                description: string;
                action: string;
            };
            interviewQuestions: {
                title: string;
                description: string;
                action: string;
            };
            chat: {
                title: string;
                description: string;
                action: string;
            };
        };
        stats: {
            knowledgeTopics: {
                value: string;
                label: string;
            };
            questions: {
                value: string;
                label: string;
            };
            categories: {
                value: string;
                label: string;
            };
            aiSupport: {
                value: string;
                label: string;
            };
        };
    };
    auth: {
        login: string;
        loginTitle: string;
    };
    prompts: {
        systemTemplates: {
            knowledge: string;
            interview: string;
            chat: string;
        };
        length: {
            short: string;
            long: string;
        };
        prefixes: {
            question: string;
            interview: string;
        };
    };
}