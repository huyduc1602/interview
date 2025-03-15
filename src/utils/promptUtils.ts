import { PromptType } from '@/types/common';
import { PromptOptions } from '@/types/common';

/**
 * System prompt templates for different use cases
 */
const systemPromptTemplates = {
    knowledge: {
        vi: `Bạn là một chuyên gia về chủ đề {topic}. PHẢI trả lời hoàn toàn bằng tiếng Việt.
Định dạng câu trả lời theo Markdown với:
- Giải thích khái niệm đơn giản trước, chi tiết sau
- Phân chia kiến thức theo mức độ (cơ bản, trung bình, nâng cao)
- Ví dụ thực tế dễ hiểu
- Mã nguồn minh họa (nếu cần) với chú thích tiếng Việt
- Tài liệu tham khảo đáng tin cậy
- So sánh với các công nghệ/khái niệm liên quan (nếu có)`,
        en: `You are an expert on {topic}. You MUST answer in English only.
Format your responses in Markdown with:
- Simple explanation first, details later
- Knowledge divided by levels (basic, intermediate, advanced)
- Easy-to-understand practical examples
- Code snippets where relevant with clear comments
- Reliable references for further study
- Comparisons with related technologies/concepts (if applicable)`
    },
    interview: {
        vi: `Bạn là một người phỏng vấn kỹ thuật cấp cao cho vị trí {role}. PHẢI trả lời hoàn toàn bằng tiếng Việt.
Định dạng câu trả lời theo Markdown với:
- Phân tích câu hỏi và cách tiếp cận tốt nhất
- Mẫu câu trả lời cho cấp độ {level}
- Các điểm cần nhấn mạnh khi trả lời
- Ví dụ cụ thể từ kinh nghiệm thực tế (nếu phù hợp)
- Câu hỏi phụ có thể được hỏi thêm
- Lỗi thường gặp khi trả lời câu hỏi này`,
        en: `You are a senior technical interviewer for a {role} position. You MUST answer in English only.
Format your responses in Markdown with:
- Analysis of the question and best approaches
- Sample answer for {level} level
- Key points to emphasize in your answer
- Specific examples from real-world experience (if applicable)
- Follow-up questions that might be asked
- Common mistakes when answering this question`
    },
    chat: {
        vi: `Bạn là một trợ lý AI thông minh, hữu ích và thân thiện. PHẢI trả lời hoàn toàn bằng tiếng Việt.
Định dạng câu trả lời theo Markdown với:
- Câu trả lời rõ ràng, súc tích
- Thông tin chính xác và hữu ích
- Giọng điệu thân thiện, hỗ trợ
- Ví dụ minh họa khi cần thiết
- Sẵn sàng làm rõ nếu có yêu cầu`,
        en: `You are a smart, helpful, and friendly AI assistant. You MUST answer in English only.
Format your responses in Markdown with:
- Clear, concise answers
- Accurate and helpful information
- Friendly, supportive tone
- Illustrative examples when needed
- Willingness to clarify if requested`
    }
};

/**
 * Generates a prompt for knowledge base questions
 * @param userPrompt - The user's original question
 * @param options - Configuration options for the prompt
 * @returns Formatted prompt with system instructions
 */
export const generateKnowledgePrompt = (userPrompt: string, options: PromptOptions): string => {
    const { language, topic = 'lập trình', includeCodeExamples = true } = options;

    let systemPrompt = systemPromptTemplates.knowledge[language]
        .replace('{topic}', topic);

    if (!includeCodeExamples) {
        systemPrompt = systemPrompt.replace(/- Mã nguồn minh họa.*\n/g, '');
        systemPrompt = systemPrompt.replace(/- Code snippets.*\n/g, '');
    }

    return `${systemPrompt}

Câu hỏi: ${userPrompt}`;
};

/**
 * Generates a prompt for interview questions
 * @param userPrompt - The user's original question
 * @param options - Configuration options for the prompt
 * @returns Formatted prompt with system instructions
 */
export const generateInterviewPrompt = (userPrompt: string, options: PromptOptions): string => {
    const {
        language,
        role = language === 'vi' ? 'Lập trình viên' : 'Software Developer',
        level = 'intermediate'
    } = options;

    const levelTranslations = {
        beginner: language === 'vi' ? 'cơ bản' : 'beginner',
        intermediate: language === 'vi' ? 'trung cấp' : 'intermediate',
        advanced: language === 'vi' ? 'nâng cao' : 'advanced'
    };

    const translatedLevel = levelTranslations[level];

    const systemPrompt = systemPromptTemplates.interview[language]
        .replace('{role}', role)
        .replace('{level}', translatedLevel);

    const prefix = language === 'vi'
        ? `Đây là câu hỏi phỏng vấn cho vị trí ${role}, cấp độ ${translatedLevel}. Hãy giải thích cách trả lời tốt nhất:`
        : `This is an interview question for a ${role} position at ${translatedLevel} level. Explain the best way to answer:`;

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
    const { language, maxResponseLength = 'medium' } = options;

    let systemPrompt = systemPromptTemplates.chat[language];

    // Add length guidance if specified
    if (maxResponseLength === 'short') {
        systemPrompt += language === 'vi'
            ? '\nHãy trả lời ngắn gọn, không quá 3 đoạn văn.'
            : '\nKeep your answer short, no more than 3 paragraphs.';
    } else if (maxResponseLength === 'long') {
        systemPrompt += language === 'vi'
            ? '\nHãy cung cấp câu trả lời chi tiết, đầy đủ.'
            : '\nProvide a detailed, comprehensive answer.';
    }

    return `${systemPrompt}

${userPrompt}`;
};

/**
 * Creates an appropriate prompt based on the prompt type
 * @param userPrompt - The user's original question 
 * @param promptType - The type of prompt to generate
 * @param options - Configuration options for the prompt
 * @returns Formatted prompt with system instructions
 */
export const createPromptByType = (
    userPrompt: string,
    promptType: PromptType,
    options: PromptOptions
): string => {
    switch (promptType) {
        case PromptType.KNOWLEDGE:
            return generateKnowledgePrompt(userPrompt, options);
        case PromptType.INTERVIEW:
            return generateInterviewPrompt(userPrompt, options);
        case PromptType.CHAT:
        default:
            return generateChatPrompt(userPrompt, options);
    }
};