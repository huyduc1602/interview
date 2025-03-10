import OpenAI from 'openai';
import type { ChatOptions } from './chat.d';
import { APIError } from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENCHAT_API_KEY,
    dangerouslyAllowBrowser: true
});

export const chatWithGPT = async (prompt: string, options: ChatOptions = {}): Promise<string> => {
    const {
        language = 'en',
        modelType = 'gpt-3.5-turbo',
        temperature = 0.7,
        max_tokens = 2000
    } = options;

    const systemPrompts = {
        vi: `Bạn là một chuyên gia phỏng vấn kỹ thuật. PHẢI trả lời hoàn toàn bằng tiếng Việt.
Định dạng câu trả lời theo Markdown với:
- Giải thích rõ ràng bằng tiếng Việt
- Ví dụ thực tế
- Mã nguồn minh họa (nếu cần) với chú thích tiếng Việt
- Các phương pháp tốt nhất
- Những lỗi thường gặp cần tránh
- Phân tích độ phức tạp (nếu là thuật toán)`,
        en: `You are an expert technical interviewer. You MUST answer in English only.
Format your responses in Markdown with:
- Clear explanations in English
- Practical examples
- Code snippets where relevant
- Best practices
- Common pitfalls to avoid
- Complexity analysis (if algorithmic)`
    };

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompts[language]
                },
                {
                    role: "system",
                    content: language === 'vi'
                        ? "Bạn PHẢI trả lời bằng tiếng Việt. Không được dùng tiếng Anh trừ khi là thuật ngữ kỹ thuật."
                        : "You MUST answer in English only. Never use other languages."
                },
                {
                    role: "user",
                    content: language === 'vi'
                        ? `Trả lời bằng tiếng Việt: ${prompt}`
                        : `Answer in English: ${prompt}`
                }
            ],
            model: modelType,
            temperature,
            max_tokens
        });
        
        return completion.choices[0].message.content || '';
        
    } catch (error) {
        if (error instanceof APIError && error.status === 429) {
            throw new Error('API_RATE_LIMIT');
        }
        throw error;
    }
};