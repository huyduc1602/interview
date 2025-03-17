import { PromptType, PromptOptions } from '@/types/common';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

/**
 * Get translation based on key and language
 * @param key Translation key
 * @param language Target language
 * @returns Translated string
 */
const getTranslation = (key: string, language: string = 'vi', replacements?: Record<string, string>): string => {
    // Force language change temporarily to get the correct translation
    const currentLanguage = i18n.language;
    i18n.changeLanguage(language);
    let translation = i18n.t(key);

    // Apply any replacements if provided
    if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
            translation = translation.replace(new RegExp(`{${key}}`, 'g'), value);
        });
    }

    i18n.changeLanguage(currentLanguage); // Restore original language
    return translation;
};

/**
 * Translation keys for prompt templates
 */
const promptTranslationKeys = {
    knowledge: {
        template: 'prompts.systemTemplates.knowledge',
        questionPrefix: 'prompts.prefixes.question'
    },
    interview: {
        template: 'prompts.systemTemplates.interview',
        questionPrefix: 'prompts.prefixes.interview'
    },
    chat: {
        template: 'prompts.systemTemplates.chat',
        default: 'chat.prompts.default'
    },
    length: {
        short: 'prompts.length.short',
        long: 'prompts.length.long'
    },
    levels: 'prompts.levels'
};

/**
 * Generates a prompt for knowledge base questions
 * @param userPrompt - The user's original question
 * @param options - Configuration options for the prompt
 * @returns Formatted prompt with system instructions
 */
export const generateKnowledgePrompt = (userPrompt: string, options: PromptOptions): string => {
    const { language = 'vi', topic = language === 'vi' ? 'lập trình' : 'programming', includeCodeExamples = true } = options;

    // Get template from localization
    let systemPrompt = getTranslation(promptTranslationKeys.knowledge.template, language, { topic });

    if (!includeCodeExamples) {
        // Remove code examples section based on language
        if (language === 'vi') {
            systemPrompt = systemPrompt.replace(/- Mã nguồn minh họa.*\n/g, '');
        } else {
            systemPrompt = systemPrompt.replace(/- Code snippets.*\n/g, '');
        }
    }

    // Get the appropriate question prefix based on language
    const questionPrefix = getTranslation(promptTranslationKeys.knowledge.questionPrefix, language);

    return `${systemPrompt}

${questionPrefix} ${userPrompt}`;
};

/**
 * Generates a prompt for interview questions
 * @param userPrompt - The user's original question
 * @param options - Configuration options for the prompt
 * @returns Formatted prompt with system instructions
 */
export const generateInterviewPrompt = (userPrompt: string, options: PromptOptions): string => {
    const {
        language = 'vi',
        role = language === 'vi' ? 'Lập trình viên' : 'Software Developer',
        level = 'intermediate'
    } = options;

    // Translate level using localization
    const translatedLevel = getTranslation(`${promptTranslationKeys.levels}.${level}`, language);

    // Get system prompt template and replace placeholders
    const systemPrompt = getTranslation(promptTranslationKeys.interview.template, language, {
        role,
        level: translatedLevel
    });

    // Generate prefix with role and level information
    const prefix = getTranslation(promptTranslationKeys.interview.questionPrefix, language, {
        role,
        level: translatedLevel
    });

    return `${systemPrompt}

${prefix} ${userPrompt}`;
};

/**
 * Generates a prompt for general chat
 * @param userPrompt - The user's original question
 * @param options - Configuration options for the prompt
 * @returns Formatted prompt with system instructions
 */
export const generateChatPrompt = (userPrompt: string, options: PromptOptions): string => {
    const { language = 'vi', maxResponseLength = 'medium' } = options;

    // Get system prompt from localization
    let systemPrompt = getTranslation(promptTranslationKeys.chat.template, language);

    // Add length guidance if specified
    if (maxResponseLength === 'short') {
        systemPrompt += '\n' + getTranslation(promptTranslationKeys.length.short, language);
    } else if (maxResponseLength === 'long') {
        systemPrompt += '\n' + getTranslation(promptTranslationKeys.length.long, language);
    }

    return `${systemPrompt}

${userPrompt}`;
};

/**
 * Support for future language additions
 * @param language The language code
 * @returns Whether the language is supported
 */
export const isLanguageSupported = (language: string): boolean => {
    return ['vi', 'en'].includes(language);
};

/**
 * Creates an appropriate prompt based on the prompt type with language support
 * @param userPrompt - The user's original question 
 * @param promptType - The type of prompt to generate
 * @param options - Configuration options for the prompt
 * @returns Formatted prompt with system instructions in the specified language
 */
export const createPromptByType = (
    userPrompt: string,
    promptType: PromptType,
    options: PromptOptions
): string => {
    // Ensure language is valid, fallback to 'vi' if not supported
    const language = options.language && isLanguageSupported(options.language)
        ? options.language
        : 'vi';

    // Update options with validated language
    const validatedOptions = {
        ...options,
        language
    };

    console.log(`Creating ${promptType} prompt in ${language} language`);

    switch (promptType) {
        case PromptType.KNOWLEDGE:
            return generateKnowledgePrompt(userPrompt, validatedOptions);
        case PromptType.INTERVIEW:
            return generateInterviewPrompt(userPrompt, validatedOptions);
        case PromptType.CHAT:
        default:
            return generateChatPrompt(userPrompt, validatedOptions);
    }
};

/**
 * Hook for accessing translated prompt templates in components
 * @returns Object with translated prompt templates
 */
export const usePromptTemplates = () => {
    const { t } = useTranslation();

    return {
        knowledgePromptTemplate: (topic: string) => {
            return t(promptTranslationKeys.knowledge.template, { topic });
        },
        interviewPromptTemplate: (role: string, level: string) => {
            const translatedLevel = t(`${promptTranslationKeys.levels}.${level}`);
            return t(promptTranslationKeys.interview.template, { role, level: translatedLevel });
        },
        chatPromptTemplate: () => t(promptTranslationKeys.chat.template),
        translateLevel: (level: string) => {
            return t(`${promptTranslationKeys.levels}.${level}`) || level;
        }
    };
};